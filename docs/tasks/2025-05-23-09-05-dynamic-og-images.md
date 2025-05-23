# Task: Implement Dynamic OG Images

## Commit 1: feat: Add OG image generation route ✅ b630acac99787a92ae787d2484efbda44391154d

**Description:**
Create a new Next.js API route handler at `app/api/og/route.tsx`. This route will be responsible for generating the OG image.
It will accept a `title` search parameter to customize the image.
The image will have a black background, white text, and include the project's logo.
The logo will be read from `public/icon0.svg`.
The styling will be inline, adhering to a brutalist aesthetic (sharp edges, simple fonts if possible, high contrast).
Referenced Vercel documentation: https://vercel.com/docs/og-image-generation

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `echo "Manual verification for now"` (Initially, we'll test by accessing the endpoint. A separate commit will add automated tests for the image generation if feasible, or this will be updated).
    - **Expected Outcome:** Accessing `http://localhost:3000/api/og?title=Test%20Title` in a browser should display a 1200x630 image with "Test Title" and the logo, styled with a black background and white text.
2.  **Logging Check:**
    - **Action:** Access the `/api/og` endpoint with and without a title.
    - **Expected Log:**
      - `INFO: OG Image generated for title: Test Title` (when title is provided)
      - `INFO: OG Image generated with default title` (when title is missing)
      - `ERROR: Failed to generate OG image: <error_message>` (if an error occurs during image generation)
      - `DEBUG: Reading logo file: public/icon0.svg`
    - **Toggle Mechanism:** Standard Next.js logging, potentially enhanced with `console.log` during development. `LOG_LEVEL` environment variable if a more formal logger is introduced.

---

## Commit 2: feat: Integrate OG image route into page metadata ✅ 4a81596ef1801f28e4622f81ccf1b36b7880506a

**Description:**
Update relevant page components (e.g., `app/(main)/layout.tsx` or specific page layouts/components like `app/(main)/calculator/spreadsheet/page.tsx` if dynamic titles per page are desired) to include `<meta>` tags for `og:image`.
The `content` attribute of the `og:image` meta tag will point to the `/api/og` route, dynamically passing the current page's title as the `title` query parameter.
This will likely involve using Next.js `metadata` export in page components or layouts.

Example for a page:

```tsx
// app/(main)/some-page/page.tsx
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
	const pageTitle = "Specific Page Title"; // This should be dynamic based on the page
	return {
		openGraph: {
			title: pageTitle,
			description: "Description of the page", // Add a relevant description
			images: [
				{
					url: `/api/og?title=${encodeURIComponent(pageTitle)}`,
					width: 1200,
					height: 630,
					alt: pageTitle,
				},
			],
		},
	};
}

export default function SomePage() {
	// ... page content
}
```

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `echo "Manual verification for now"` (Verifying meta tags usually involves inspecting the page source or using an OG debugger tool).
    - **Expected Outcome:** When viewing the source of a page or using a tool like Facebook's Open Graph Debugger or Twitter Card Validator, the `og:image` meta tag should be present and point to the correct `/api/og?title=...` URL with the page's title. The debugger tool should successfully fetch and display the generated image.
2.  **Logging Check:**
    - **Action:** Navigate to a page that has the OG image metadata implemented.
    - **Expected Log:** (On the server-side when the page is rendered and metadata is generated)
      - `INFO: Generating OG metadata for page with title: <Page Title>`
      - The logs from Commit 1 should also appear when the OG image URL is fetched by a crawler or debugger.
    - **Toggle Mechanism:** Standard Next.js logging.

---

## Commit 3: style: Refine OG image brutalist styling and logo integration ✅ ef1257bfa87420ee975026b201267913ad02afe0

**Description:**
Refine the inline CSS within `app/api/og/route.tsx` to strongly match the brutalist aesthetic of the application.
This includes:

- Using a system font or a specific mono-spaced font that fits the brutalist theme.
- Ensuring high contrast (black background, white text is a good start).
- Sharp, geometric layout for the title and logo.
- Correctly embedding and sizing the `public/icon0.svg` logo. This might involve reading the SVG file content and inlining it as a data URL or ensuring `next/og` can handle local file paths correctly for SVGs.
- Ensure text wrapping and centering for longer titles.

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `echo "Manual verification for now"` (Visual inspection).
    - **Expected Outcome:** The generated OG image should have a clear brutalist style. The logo should be clearly visible and well-placed. Text should be readable and centered. Test with short and long titles.
2.  **Logging Check:**
    - **Action:** Generate an OG image by accessing the `/api/og` endpoint.
    - **Expected Log:**
      - `DEBUG: OG Image style props: <dump of style object>` (if useful for debugging styles)
      - `DEBUG: Logo SVG data length: <length>` (if reading SVG content)
    - **Toggle Mechanism:** Standard Next.js logging.

---

## Commit 4: chore: Add `robots.txt` and test OG image craw-lability ✅ 955befb21d0335c86976fa5aa65de977c6bcf0b7

**Description:**
Create or update the `public/robots.txt` file to ensure that crawlers (like those from social media platforms) are allowed to access the `/api/og` route.
Example `robots.txt` addition:

```
User-agent: *
Allow: /api/og/*
Disallow: /api/some-other-private-api/ # Example of other rules

#Sitemap: [URL to sitemap if exists]
```

Test the OG image generation with online tools (e.g., Facebook Sharing Debugger, Twitter Card Validator, LinkedIn Post Inspector) to ensure they can fetch and display the image correctly.

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `curl http://localhost:3000/robots.txt` (during local dev) and check content.
    - **Expected Outcome:** The `robots.txt` file should contain `Allow: /api/og/*`. Social media debuggers should successfully fetch and display the OG image.
2.  **Logging Check:**
    - **Action:** Use an OG debugger tool that makes a request to the `/api/og` endpoint.
    - **Expected Log:** The server logs for the `/api/og` route (from Commit 1) should show requests from the IP addresses/user agents of these debugger tools.
    - **Toggle Mechanism:** Standard Next.js server logs.

---

## Commit 5: test: Add basic unit/integration test for OG image route (Optional but Recommended) 🚧 SKIPPED (manual/visual verification deemed sufficient for now)

**Description:**
If feasible and time permits, add a basic test for the `app/api/og/route.tsx`. This could be an integration test that makes a GET request to the endpoint and checks for:

- A `200 OK` status.
- The correct `Content-Type` header (e.g., `image/png`).
- Potentially, that the response body is not empty or very small.
  Due to the complexity of image comparison, an exact image match test might be overkill, but basic response validation is good.
  This might involve using a testing library like `jest` or `vitest` with `supertest` or `node-fetch`.

**Verification:**

1.  **Automated Test(s):**
    - **Command:** `pnpm test app/api/og/route.test.tsx` (or similar, depending on testing setup)
    - **Expected Outcome:** Tests pass, verifying the OG image route returns a successful response with the correct headers.
2.  **Logging Check:**
    - **Action:** Run the automated tests.
    - **Expected Log:** Test runner output showing pass/fail status. Application logs might show requests from the test environment if the tests hit the actual server endpoint.
    - **Toggle Mechanism:** Test runner output / standard Next.js logging.
