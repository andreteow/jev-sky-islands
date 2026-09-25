# Sky Island Hatchlings

**Play:** https://jev-sky-islands-rouge.vercel.app (ask whoever shared this link for the invite code)

Hatch a creature from your own description, then talk your way across 10 floating islands.
Type anything: **Jev** (TypeSafe) judges each move, the dice decide, and your creature's
personality (kind / sneaky / brave / silly) grows from how you play.

## Run it

```bash
cd game
npm install      # first time only
npm run dev -- -p 3030
```

Open http://localhost:3030. On your own computer the invite code defaults to `SKYPIP`. The online version uses its own secret code, set as `INVITE_CODE` on Vercel.

Settings in `.env.local`:

| Setting | What it does |
| --- | --- |
| `INVITE_CODE` | The code friends type to get in (required online; `SKYPIP` locally) |
| `DAILY_TURN_LIMIT` | Turns per player per day (default 120) |
| `NO_VIDEO=1` | Skip making Seedance videos and show pictures instead (saves credits while tinkering) |
| `OPENROUTER_API_KEY`, `TYPESAFE_API_KEY`, `HIGGSFIELD_API_KEY` | The three AI services |

`ffmpeg` (installed with Homebrew) shrinks each downloaded video from about 13 MB to about 3 MB. Without it, videos still work but load slower.

## What each AI does

| Job | Model |
| --- | --- |
| Judge every move: will it work, style, fit, cheating, safety | Jev `jev-latest` (TypeSafe) |
| Characters' replies, narration, hints, video scripts | GPT-6 Luna (OpenRouter) |
| Player's creature and adventurer, the 3 evolutions, all game art | GPT Image 2 (OpenRouter) |
| 15 personalised 10-second movies per player | Seedance 2.5 (Higgsfield) |

Per player: 5 portraits and 15 videos (hatching, 10 island intros, 3 evolutions, the ending).
The next island's movie starts filming when you reach the current island's final challenge,
so it's usually ready when you arrive.

## Where things live

- `src/content/islands.ts`: all 10 islands and 30 challenges (edit freely)
- `src/lib/game.ts`: turn rules, chance recipe, personality points, hints
- `src/lib/media.ts`: when each personalised picture/movie is made, and the prompts
- `src/components/`: the screens
- `data/`: saved players and their media (not committed). Delete a file in `data/players/` to reset that player.

## Online (Vercel + Supabase)

- On your computer, saves and media are files in `data/`.
- When `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set (Vercel's Supabase integration does this), saves go to the `sih_players` table and pictures and movies go to the private `sih-media` storage bucket. The browser only ever gets short-lived private links.
- Picture and movie making runs in the background after each request (`after()`, up to 5 minutes per request). Movies are checked each time the game screen refreshes.
- Vercel has no `ffmpeg`, so online movies stay at their original size (about 13 MB each).
- Set these on Vercel: `OPENROUTER_API_KEY`, `TYPESAFE_API_KEY`, `HIGGSFIELD_API_KEY`, `INVITE_CODE`, `DAILY_TURN_LIMIT`.
