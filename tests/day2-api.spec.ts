import { test, expect } from './fixtures/auth.fixture';
import { z } from 'zod';

// ── Zod Schemas ──────────────────────────────────────────────

const EventSchema = z.object({
  id:             z.number(),
  title:          z.string(),
  description:    z.string(),
  category:       z.string(),
  venue:          z.string(),
  city:           z.string(),
  eventDate:      z.string(),
  price:          z.string(),
  totalSeats:     z.number(),
  availableSeats: z.number(),
  imageUrl:       z.string(),
  isStatic:       z.boolean(),
  userId:         z.number().nullable(),
  createdAt:      z.string(),
  updatedAt:      z.string(),
});

const PaginationSchema = z.object({
  total:      z.number(),
  page:       z.number(),
  limit:      z.number(),
  totalPages: z.number(),
});

const EventsResponseSchema = z.object({
  success:    z.boolean(),
  data:       z.array(EventSchema),
  pagination: PaginationSchema,
});

/*
const SingleEventResponseSchema = z.object({
  success: z.boolean(),
  data:    EventSchema,
});
*/

const EventMutationResponseSchema = z.object({
  success: z.boolean(),
  data:    EventSchema,
  message: z.string(),
});

const DeleteResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// ── Tests ─────────────────────────────────────────────────────

test.describe('API Testing — Events GET', () => {

  test('GET /events should return 200, success:true and valid schema', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.get('/api/events');

    // Assert status
    expect(response.status()).toBe(200);

    const body = await response.json();

    // Assert success field
    expect(body.success).toBe(true);

    // Assert schema
    expect(() => EventsResponseSchema.parse(body)).not.toThrow();
  });

  /*
  test('GET /events should return paginated results', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.get('/api/events?page=1&limit=2');
    const body = await response.json();
    expect(body.pagination.page).toBe(1);
    expect(body.data.length).toBeLessThanOrEqual(2);
  });

  test('GET /events/{id} should return single event with valid schema', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.get('/api/events/1');

    // Assert status
    expect(response.status()).toBe(200);

    const body = await response.json();

    // Assert specific fields
    expect(body.data.id).toBe(1);
    expect(body.data.title).toBe('World Tech Summit');

    // Assert schema
    expect(() => SingleEventResponseSchema.parse(body)).not.toThrow();
  });

  test('GET /events without token should return 401', async ({ request }) => {
    const response = await request.get(`${process.env.API_BASE_URL}/events`);

    // Assert status
    expect(response.status()).toBe(401);

    const body = await response.json();

    // Assert error fields
    expect(body.success).toBe(false);
    expect(body.error).toBe('Unauthorized');
  });
*/

});

test.describe('API Testing — Events CRUD', () => {

  // Run sequentially — PUT and DELETE depend on POST
  test.describe.configure({ mode: 'serial' });

  // Shared variable to store created event ID across tests
  let createdEventId: number;

  test('POST /events should create a new event', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.post('/api/events', {
      data: {
        title:       'Playwright Automation Test Event',
        description: 'Created by automated test',
        category:    'Conference',
        venue:       'Test Venue, Vadodara',
        city:        'Vadodara',
        eventDate:   '2026-12-31T10:00:00.000Z',
        price:       99,
        totalSeats:  50,
        imageUrl:    'https://picsum.photos/200',
      },
    });

    // Assert status
    expect(response.status()).toBe(201);

    const body = await response.json();

    // Assert response fields
    expect(body.success).toBe(true);
    expect(body.message).toBe('Event created successfully');
    expect(body.data.id).toBeDefined();
    expect(body.data.title).toBe('Playwright Automation Test Event');
    expect(body.data.availableSeats).toBe(50);
    expect(body.data.isStatic).toBe(false);

    // Assert schema
    expect(() => EventMutationResponseSchema.parse(body)).not.toThrow();

    // Store ID for PUT and DELETE tests
    createdEventId = body.data.id;
  });

  test('PUT /events/{id} should update the created event', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.put(`/api/events/${createdEventId}`, {
      data: {
        title:       'Playwright Automation Test Event — Updated',
        description: 'Updated by automated test',
        category:    'Concert',
        venue:       'Updated Venue, Vadodara',
        city:        'Vadodara',
        eventDate:   '2026-12-31T10:00:00.000Z',
        price:       199,
        totalSeats:  75,
        imageUrl:    'https://picsum.photos/200',
      },
    });

    // Assert status
    expect(response.status()).toBe(200);

    const body = await response.json();

    // Assert response fields
    expect(body.success).toBe(true);
    expect(body.message).toBe('Event updated successfully');
    expect(body.data.id).toBe(createdEventId);
    expect(body.data.title).toBe('Playwright Automation Test Event — Updated');
    expect(body.data.category).toBe('Concert');
    expect(body.data.price).toBe('199');

    // Assert schema
    expect(() => EventMutationResponseSchema.parse(body)).not.toThrow();
  });

  test('DELETE /events/{id} should delete event and verify it is gone', async ({ authenticatedRequest }) => {
    // Step 1 — Delete the event
    const deleteResponse = await authenticatedRequest.delete(`/api/events/${createdEventId}`);

    // Assert delete status
    expect(deleteResponse.status()).toBe(200);

    const deleteBody = await deleteResponse.json();

    // Assert delete response fields
    expect(deleteBody.success).toBe(true);
    expect(deleteBody.message).toBe('Event deleted successfully');

    // Assert delete schema
    expect(() => DeleteResponseSchema.parse(deleteBody)).not.toThrow();

    // Step 2 — Verify event is truly gone
    const getResponse = await authenticatedRequest.get(`/api/events/${createdEventId}`);
    expect(getResponse.status()).toBe(404);
  });

});