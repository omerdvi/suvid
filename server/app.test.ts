import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from './app';

describe('SuVid API', () => {
  it('searches ingredients in Hebrew', async () => {
    const app = createApp({ dataDir: ':memory:' });
    const response = await request(app).get('/api/search?q=אסאדו').expect(200);

    expect(response.body.kind).toBe('match');
    expect(response.body.ingredient.name).toBe('אסאדו');
  });

  it('lists ingredients grouped by category for browsing', async () => {
    const app = createApp({ dataDir: ':memory:' });
    const response = await request(app).get('/api/catalog').expect(200);

    expect(response.body.categories).toContainEqual(
      expect.objectContaining({
        name: 'בקר',
        ingredients: expect.arrayContaining([
          expect.objectContaining({ id: 'asado', name: 'אסאדו' })
        ])
      })
    );
    expect(response.body.totalIngredients).toBeGreaterThan(8);
  });

  it('returns ingredient detail with calculator options', async () => {
    const app = createApp({ dataDir: ':memory:' });
    const response = await request(app).get('/api/ingredients/asado').expect(200);

    expect(response.body.name).toBe('אסאדו');
    expect(response.body.options[0].temperatureC).toBe(75);
    expect(response.body.recommendations[0].title).toContain('אסאדו');
  });

  it('stores rich public ratings', async () => {
    const app = createApp({ dataDir: ':memory:' });
    const response = await request(app)
      .post('/api/ratings')
      .send({
        targetId: 'asado-recommended',
        stars: 5,
        note: 'יצא מעולה',
        textureFeedback: 'בדיוק',
        nextTime: 'עוד צריבה'
      })
      .expect(201);

    expect(response.body.rating.stars).toBe(5);
    expect(response.body.rating.nextTime).toBe('עוד צריבה');
  });

  it('rejects ratings for a calculator option that does not exist', async () => {
    const app = createApp({ dataDir: ':memory:' });

    await request(app)
      .post('/api/ratings')
      .send({
        targetId: 'missing-option',
        stars: 5,
        note: 'ok',
        textureFeedback: 'ok',
        nextTime: 'ok'
      })
      .expect(400);
  });

  it('returns aggregated rating summaries by target', async () => {
    const app = createApp({ dataDir: ':memory:' });
    await request(app).post('/api/ratings').send({
      targetId: 'asado-recommended',
      stars: 5,
      note: 'מעולה',
      textureFeedback: 'מדויק',
      nextTime: 'עוד צריבה'
    });
    await request(app).post('/api/ratings').send({
      targetId: 'asado-recommended',
      stars: 3,
      note: 'טוב',
      textureFeedback: 'רך מדי',
      nextTime: 'פחות זמן'
    });

    const response = await request(app).get('/api/ratings/summary').expect(200);

    expect(response.body.summaries['asado-recommended']).toMatchObject({
      targetId: 'asado-recommended',
      count: 2,
      averageStars: 4,
      commonNextTime: ['עוד צריבה', 'פחות זמן']
    });
  });

  it('stores public recipe suggestions for review', async () => {
    const app = createApp({ dataDir: ':memory:' });
    const response = await request(app)
      .post('/api/suggestions')
      .send({
        ingredientName: 'פרגית',
        temperatureC: 68,
        timeHours: 2,
        prep: 'מלח ופפריקה',
        finish: 'צריבה במחבת',
        notes: 'לבדיקה',
        sourceUrl: 'https://example.com'
      })
      .expect(201);

    expect(response.body.suggestion.status).toBe('pending_review');
    expect(response.body.suggestion.ingredientName).toBe('פרגית');
  });

  it('rejects recipe suggestions without usable preparation details', async () => {
    const app = createApp({ dataDir: ':memory:' });

    await request(app)
      .post('/api/suggestions')
      .send({
        ingredientName: 'pargit',
        prep: '   ',
        finish: '',
        notes: '   '
      })
      .expect(400);
  });

  it('hides the suggestions list behind an admin key', async () => {
    const app = createApp({ dataDir: ':memory:', adminKey: 'secret' });

    await request(app).get('/api/suggestions').expect(401);
    await request(app).get('/api/suggestions').set('x-admin-key', 'wrong').expect(401);
    await request(app).get('/api/suggestions').set('x-admin-key', 'secret').expect(200);
  });

  it('disables admin endpoints when no admin key is configured', async () => {
    const app = createApp({ dataDir: ':memory:', adminKey: '' });
    await request(app).get('/api/suggestions').set('x-admin-key', 'anything').expect(403);
  });

  it('lets an admin approve a recipe suggestion', async () => {
    const app = createApp({ dataDir: ':memory:', adminKey: 'secret' });

    const created = await request(app)
      .post('/api/suggestions')
      .send({ ingredientName: 'פיקניה', prep: 'מלח', finish: 'צריבה', notes: 'לבדיקה' })
      .expect(201);
    const id = created.body.suggestion.id;

    const listed = await request(app).get('/api/suggestions').set('x-admin-key', 'secret').expect(200);
    expect(listed.body.suggestions).toHaveLength(1);
    expect(listed.body.suggestions[0].status).toBe('pending_review');

    const updated = await request(app)
      .patch(`/api/suggestions/${id}`)
      .set('x-admin-key', 'secret')
      .send({ status: 'approved' })
      .expect(200);
    expect(updated.body.suggestion.status).toBe('approved');
  });

  it('publishes an approved suggestion (with temp + time) to the community calculator feed', async () => {
    const app = createApp({ dataDir: ':memory:', adminKey: 'secret' });

    const withData = await request(app)
      .post('/api/suggestions')
      .send({ ingredientName: 'קבב פרגית', temperatureC: 65, timeHours: 2, prep: 'מלח', finish: 'צריבה', notes: 'עסיסי' });
    const withoutData = await request(app)
      .post('/api/suggestions')
      .send({ ingredientName: 'בלי נתונים', prep: 'מלח', finish: 'צריבה', notes: 'אין טמפ' });

    // nothing published until approved
    let feed = await request(app).get('/api/community').expect(200);
    expect(feed.body.contributions).toHaveLength(0);

    await request(app)
      .patch(`/api/suggestions/${withData.body.suggestion.id}`)
      .set('x-admin-key', 'secret')
      .send({ status: 'approved' });
    await request(app)
      .patch(`/api/suggestions/${withoutData.body.suggestion.id}`)
      .set('x-admin-key', 'secret')
      .send({ status: 'approved' });

    feed = await request(app).get('/api/community').expect(200);
    expect(feed.body.contributions).toHaveLength(1);
    expect(feed.body.contributions[0]).toMatchObject({ ingredientName: 'קבב פרגית', temperatureC: 65, timeHours: 2 });
  });

  it('rejects an unknown review status and a missing suggestion', async () => {
    const app = createApp({ dataDir: ':memory:', adminKey: 'secret' });

    await request(app)
      .patch('/api/suggestions/anything')
      .set('x-admin-key', 'secret')
      .send({ status: 'bogus' })
      .expect(400);

    await request(app)
      .patch('/api/suggestions/missing')
      .set('x-admin-key', 'secret')
      .send({ status: 'approved' })
      .expect(404);
  });
});
