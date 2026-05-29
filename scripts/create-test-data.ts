import * as xlsx from 'xlsx';
import path from 'path';

// Define test cases based on EventHub features
const testCases = [
  // ── Login Module ──────────────────────────────────────────
  {
    TestID:         'TC-001',
    Module:         'Login',
    TestName:       'Valid login with correct credentials',
    Priority:       'High',
    InputData:      JSON.stringify({
      email:       'ravin.purani@jeavio.com',
      expectedUrl: 'https://eventhub.rahulshettyacademy.com',
    }),
    Steps:          'Navigate to /login│Fill email│Fill password│Click Sign In',
    ExpectedResult: 'User redirected to home page',
    TestType:       'UI',
    Enabled:        'TRUE',
  },
  {
    TestID:         'TC-002',
    Module:         'Login',
    TestName:       'Invalid login with wrong credentials',
    Priority:       'High',
    InputData:      JSON.stringify({
      email:    'wrong@email.com',
      password: 'wrongpassword',
    }),
    Steps:          'Navigate to /login│Fill wrong email│Fill wrong password│Click Sign In',
    ExpectedResult: 'Error toast: Invalid email or password',
    TestType:       'UI',
    Enabled:        'TRUE',
  },
  {
    TestID:         'TC-003',
    Module:         'Login',
    TestName:       'Empty form validation on login',
    Priority:       'Medium',
    InputData:      JSON.stringify({}),
    Steps:          'Navigate to /login│Click Sign In without filling fields',
    ExpectedResult: 'Inline validation messages appear',
    TestType:       'UI',
    Enabled:        'TRUE',
  },

  // ── Events Module ─────────────────────────────────────────
  {
    TestID:         'TC-004',
    Module:         'Events',
    TestName:       'Events page displays all UI elements',
    Priority:       'High',
    InputData:      JSON.stringify({
      expectedHeading: 'Upcoming Events',
    }),
    Steps:          'Login│Navigate to /events│Verify heading│Verify search bar│Verify dropdowns',
    ExpectedResult: 'All UI elements visible on Events page',
    TestType:       'UI',
    Enabled:        'TRUE',
  },
  {
    TestID:         'TC-005',
    Module:         'Events',
    TestName:       'Search events by keyword',
    Priority:       'High',
    InputData:      JSON.stringify({
      searchTerm:    'World Tech Summit',
      expectedTitle: 'World Tech Summit',
    }),
    Steps:          'Login│Navigate to /events│Type search term│Verify result',
    ExpectedResult: 'Matching event appears in results',
    TestType:       'UI',
    Enabled:        'TRUE',
  },
  {
    TestID:         'TC-006',
    Module:         'Events',
    TestName:       'Filter events by category Conference',
    Priority:       'Medium',
    InputData:      JSON.stringify({
      category: 'Conference',
    }),
    Steps:          'Login│Navigate to /events│Select Conference from category dropdown',
    ExpectedResult: 'Events filtered by Conference category',
    TestType:       'UI',
    Enabled:        'TRUE',
  },
  {
    TestID:         'TC-007',
    Module:         'Events',
    TestName:       'Filter events by city Delhi',
    Priority:       'Medium',
    InputData:      JSON.stringify({
      city:           'Delhi',
      expectedVenue:  'Pragati Maidan Exhibition Grounds, Delhi',
    }),
    Steps:          'Login│Navigate to /events│Select Delhi from city dropdown',
    ExpectedResult: 'Delhi events visible in results',
    TestType:       'UI',
    Enabled:        'TRUE',
  },
  {
    TestID:         'TC-008',
    Module:         'Events',
    TestName:       'No results for unmatched search',
    Priority:       'Low',
    InputData:      JSON.stringify({
      searchTerm: 'xyznonexistent123',
    }),
    Steps:          'Login│Navigate to /events│Type non-existent search term',
    ExpectedResult: 'No Book Now buttons visible',
    TestType:       'UI',
    Enabled:        'TRUE',
  },

  // ── API Module ────────────────────────────────────────────
  {
    TestID:         'TC-009',
    Module:         'API',
    TestName:       'GET /events returns 200 with valid schema',
    Priority:       'High',
    InputData:      JSON.stringify({
      endpoint: '/api/events',
      method:   'GET',
    }),
    Steps:          'Get auth token│Send GET /api/events with token│Validate response',
    ExpectedResult: 'Status 200, success:true, valid schema',
    TestType:       'API',
    Enabled:        'TRUE',
  },
  {
    TestID:         'TC-010',
    Module:         'API',
    TestName:       'GET /events without token returns 401',
    Priority:       'High',
    InputData:      JSON.stringify({
      endpoint: '/api/events',
      method:   'GET',
      token:    'none',
    }),
    Steps:          'Send GET /api/events without auth token│Validate response',
    ExpectedResult: 'Status 401, success:false, error:Unauthorized',
    TestType:       'API',
    Enabled:        'TRUE',
  },
  {
    TestID:         'TC-011',
    Module:         'API',
    TestName:       'POST /events creates new event',
    Priority:       'High',
    InputData:      JSON.stringify({
      endpoint:    '/api/events',
      method:      'POST',
      title:       'Excel Driven Test Event',
      category:    'Conference',
      city:        'Vadodara',
      price:       99,
      totalSeats:  50,
    }),
    Steps:          'Get auth token│Send POST /api/events with data│Validate response',
    ExpectedResult: 'Status 201, event created with id',
    TestType:       'API',
    Enabled:        'TRUE',
  },
  {
    TestID:         'TC-012',
    Module:         'API',
    TestName:       'DELETE /events removes event',
    Priority:       'Medium',
    InputData:      JSON.stringify({
      endpoint: '/api/events/:id',
      method:   'DELETE',
    }),
    Steps:          'Get auth token│Create event│Delete event│Verify 404',
    ExpectedResult: 'Status 200, message: Event deleted successfully',
    TestType:       'API',
    Enabled:        'TRUE',
  },

  // ── Navigation Module ─────────────────────────────────────
  {
    TestID:         'TC-013',
    Module:         'Navigation',
    TestName:       'Navigate to Events page from navbar',
    Priority:       'High',
    InputData:      JSON.stringify({
      testId:      'nav-events',
      expectedUrl: '/events',
    }),
    Steps:          'Login│Click Events in navbar│Verify URL and heading',
    ExpectedResult: 'URL contains /events, Upcoming Events heading visible',
    TestType:       'UI',
    Enabled:        'TRUE',
  },
  {
    TestID:         'TC-014',
    Module:         'Navigation',
    TestName:       'Navigate to My Bookings page from navbar',
    Priority:       'High',
    InputData:      JSON.stringify({
      testId:      'nav-bookings',
      expectedUrl: '/bookings',
    }),
    Steps:          'Login│Click My Bookings in navbar│Verify URL and heading',
    ExpectedResult: 'URL contains /bookings, My Bookings heading visible',
    TestType:       'UI',
    Enabled:        'TRUE',
  },
  {
    TestID:         'TC-015',
    Module:         'Navigation',
    TestName:       'Logout redirects to login page',
    Priority:       'High',
    InputData:      JSON.stringify({
      expectedUrl: '/login',
    }),
    Steps:          'Login│Click Logout button│Verify redirect to login',
    ExpectedResult: 'URL contains /login, Sign in to EventHub heading visible',
    TestType:       'UI',
    Enabled:        'TRUE',
  },

  // ── Database Module ───────────────────────────────────────
  {
    TestID:         'TC-016',
    Module:         'Database',
    TestName:       'Retrieve all users from database',
    Priority:       'High',
    InputData:      JSON.stringify({
      query:        'SELECT * FROM users',
      minRows:      3,
    }),
    Steps:          'Connect to DB│Run SELECT query│Validate results',
    ExpectedResult: 'At least 3 users returned with correct columns',
    TestType:       'DB',
    Enabled:        'TRUE',
  },
  {
    TestID:         'TC-017',
    Module:         'Database',
    TestName:       'Admin user has correct role in database',
    Priority:       'High',
    InputData:      JSON.stringify({
      email:        'admin@example.com',
      expectedRole: 'admin',
    }),
    Steps:          'Connect to DB│Query user by email│Validate role',
    ExpectedResult: 'Admin user found with role=admin',
    TestType:       'DB',
    Enabled:        'TRUE',
  },
  {
    TestID:         'TC-018',
    Module:         'Database',
    TestName:       'Password never stored in plain text',
    Priority:       'High',
    InputData:      JSON.stringify({
      query:       'SELECT password_hash FROM users',
      hashPrefix:  '$2b$',
    }),
    Steps:          'Connect to DB│Query all password hashes│Verify bcrypt format',
    ExpectedResult: 'All passwords start with $2b$ bcrypt prefix',
    TestType:       'DB',
    Enabled:        'TRUE',
  },
  {
    TestID:         'TC-019',
    Module:         'Database',
    TestName:       'Insert user and verify with ROLLBACK',
    Priority:       'Medium',
    InputData:      JSON.stringify({
      email:    'excel-test@example.com',
      username: 'exceltest',
      role:     'user',
    }),
    Steps:          'Connect to DB│BEGIN│Insert user│Verify│ROLLBACK',
    ExpectedResult: 'User inserted and verified, then rolled back',
    TestType:       'DB',
    Enabled:        'TRUE',
  },

  // ── Disabled test example ─────────────────────────────────
  {
    TestID:         'TC-020',
    Module:         'Events',
    TestName:       'Book event end to end flow',
    Priority:       'Low',
    InputData:      JSON.stringify({
      eventId: 1,
    }),
    Steps:          'Login│Navigate to event│Click Book Now│Complete booking',
    ExpectedResult: 'Booking confirmed with reference number',
    TestType:       'E2E',
    Enabled:        'FALSE',
  },
];

// Create workbook and worksheet
const wb = xlsx.utils.book_new();
const ws = xlsx.utils.json_to_sheet(testCases);

// Set column widths for readability
ws['!cols'] = [
  { wch: 8 },   // TestID
  { wch: 12 },  // Module
  { wch: 45 },  // TestName
  { wch: 10 },  // Priority
  { wch: 60 },  // InputData
  { wch: 60 },  // Steps
  { wch: 45 },  // ExpectedResult
  { wch: 10 },  // TestType
  { wch: 8 },   // Enabled
];

xlsx.utils.book_append_sheet(wb, ws, 'TestCases');

// Save to test-data folder
const outputPath = path.join(process.cwd(), 'test-data', 'test-cases.xlsx');
xlsx.writeFile(wb, outputPath);

console.log(`✅ test-cases.xlsx created at ${outputPath}`);
console.log(`📊 Total test cases: ${testCases.length}`);
console.log(`✅ Enabled: ${testCases.filter(tc => tc.Enabled === 'TRUE').length}`);
console.log(`⏭️  Disabled: ${testCases.filter(tc => tc.Enabled === 'FALSE').length}`);