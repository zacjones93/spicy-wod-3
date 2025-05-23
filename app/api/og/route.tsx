import { ImageResponse } from \'next/og\';
import { NextRequest } from \'next/server\';
import fs from \'fs\';
import path from \'path\';

export const runtime = \'edge\';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get(\'title\') || \'Spicy WOD\'; // Default title

  try {
    const logoPath = path.join(process.cwd(), \'public\', \'icon0.svg\');
    console.debug(`Reading logo file: ${logoPath}`);
    const logoSvg = fs.readFileSync(logoPath, \'utf-8\');

    // Basic SVG to data URL conversion (simplified)
    // A more robust solution might be needed for complex SVGs or specific styling.
    const logoDataUrl = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString(\'base64\')}`;

    console.info(`OG Image generated for title: ${title}`);

    return new ImageResponse(
      (
        <div
          style={{
            height: \'100%\',
            width: \'100%\',
            display: \'flex\',
            flexDirection: \'column\',
            alignItems: \'center\',
            justifyContent: \'center\',
            backgroundColor: \'black\',
            color: \'white\',
            fontFamily: \'"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace\', // System mono-spaced font
            padding: \'40px\',
            border: \'10px solid white\', // Brutalist border
          }}
        >
          <img
            src={logoDataUrl}
            alt="Logo"
            width="100" // Adjust size as needed
            height="100" // Adjust size as needed
            style={{ marginBottom: \'30px\' }}
          />
          <div
            style={{
              fontSize: 60,
              textAlign: \'center\',
              maxWidth: \'80%\',
              wordWrap: \'break-word\',
              overflowWrap: \'break-word\',
            }}
          >
            {title}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        // Supported options:
        // emojis: \'twemoji\', // Twitter Emoji
        // fonts: [
        //   {
        //     name: \'Typewriter\',
        //     data: fontData,
        //     weight: 400,
        //     style: \'normal\',
        //   },
        // ],
      }
    );
  } catch (error: any) {
    console.error(`Failed to generate OG image: ${error.message}`);
    return new Response(\`Failed to generate image: ${error.message}\`, { status: 500 });
  }
} 