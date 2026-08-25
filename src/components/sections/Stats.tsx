import { profile } from "@/lib/data";
import { LevelHead } from "@/components/ui/LevelHead";
import { Reveal } from "@/components/ui/Reveal";
import { GithubMark } from "@/components/ui/SocialIcon";

/* ------------------------------- API types ------------------------------- */

type GhUser = {
  login: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

type GhRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
};

const LANG_COLOR: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "C++": "#f34b7d",
  C: "#8d8fa8",
  "Jupyter Notebook": "#DA5B0B",
};

/* ------------------------------- data fetch ------------------------------- */

async function getGithub() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "vrushi-portfolio",
  };

  // Optional: set GITHUB_TOKEN to lift the 60 req/hr anonymous cap.
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [userRes, repoRes] = await Promise.all([
      fetch(`https://api.github.com/users/${profile.githubUser}`, {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch(
        `https://api.github.com/users/${profile.githubUser}/repos?per_page=100&sort=pushed`,
        { headers, next: { revalidate: 3600 } },
      ),
    ]);

    if (!userRes.ok || !repoRes.ok) return null;

    const user = (await userRes.json()) as GhUser;
    const repos = (await repoRes.json()) as GhRepo[];
    if (!Array.isArray(repos)) return null;

    const own = repos.filter((r) => !r.fork);
    const stars = own.reduce((n, r) => n + r.stargazers_count, 0);
    const forks = own.reduce((n, r) => n + r.forks_count, 0);

    const langCount = new Map<string, number>();
    own.forEach((r) => {
      if (!r.language) return;
      langCount.set(r.language, (langCount.get(r.language) ?? 0) + 1);
    });
    const total = [...langCount.values()].reduce((a, b) => a + b, 0) || 1;
    const languages = [...langCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, share: Math.round((count / total) * 100) }));

    const top = [...own]
      .sort(
        (a, b) =>
          b.stargazers_count - a.stargazers_count ||
          new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime(),
      )
      .slice(0, 4);

    return {
      user,
      stars,
      forks,
      languages,
      top,
      repoCount: own.length,
      since: new Date(user.created_at).getFullYear(),
    };
  } catch {
    return null;
  }
}

/* -------------------------------- section -------------------------------- */

export async function Stats() {
  const data = await getGithub();
  const profileUrl = `https://github.com/${profile.githubUser}`;

  return (
    <section id="stats" className="section-pad relative">
      <div className="shell">
        <LevelHead
          num="04"
          tag="Stats"
          label="GitHub"
          headline="The public scoreboard."
          lede="Read live from the GitHub API and refreshed hourly. Nothing here is typed in by hand — if the numbers look modest, that's because they're real."
        />

        {!data ? (
          <Reveal>
            <div className="panel brackets relative mt-12 flex flex-col items-start justify-between gap-5 p-7 sm:flex-row sm:items-center">
              <div>
                <p className="font-display text-lg font-black uppercase text-gold">
                  Connection lost
                </p>
                <p className="mt-1.5 text-[0.95rem] text-ink-dim">
                  The GitHub API is rate-limited or unreachable right now. The profile
                  itself is always current.
                </p>
              </div>
              <a
                href={profileUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-sm shrink-0"
              >
                <GithubMark className="h-3 w-3" />
                Open profile
              </a>
            </div>
          </Reveal>
        ) : (
          <>
            {/* Score panel */}
            <Reveal>
              <dl className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  { label: "Repos", value: data.repoCount, color: "text-cyan" },
                  { label: "Stars", value: data.stars, color: "text-gold" },
                  { label: "Forks", value: data.forks, color: "text-lime" },
                  { label: "Followers", value: data.user.followers, color: "text-magenta" },
                ].map((f) => (
                  <div key={f.label} className="panel brackets relative px-5 py-6">
                    <dt className="pixel">{f.label}</dt>
                    <dd
                      className={`mt-3 font-display text-[clamp(1.9rem,4.5vw,3rem)] font-black leading-none tabular-nums ${f.color}`}
                    >
                      {String(f.value).padStart(2, "0")}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {/* Language bars */}
              <Reveal>
                <div className="panel h-full p-6">
                  <div className="flex items-baseline justify-between border-b border-violet/30 pb-3">
                    <h3 className="hud text-cyan">Language mix</h3>
                    <span className="pixel">@{profile.githubUser}</span>
                  </div>

                  {data.languages.length === 0 ? (
                    <p className="mt-5 text-[0.9rem] text-ink-dim">
                      No language data published yet.
                    </p>
                  ) : (
                    <table className="mt-5 w-full">
                      <caption className="sr-only">
                        Share of public repositories by primary language
                      </caption>
                      <tbody>
                        {data.languages.map((l) => (
                          <tr key={l.name}>
                            <th
                              scope="row"
                              className="py-2.5 pr-4 text-left text-[0.9rem] font-medium text-ink"
                            >
                              {l.name}
                            </th>
                            <td className="w-full py-2.5">
                              {/* Segmented bar — reads as an arcade power meter */}
                              <div className="flex gap-[3px]">
                                {Array.from({ length: 20 }).map((_, i) => (
                                  <span
                                    key={i}
                                    className="h-3 flex-1"
                                    style={{
                                      background:
                                        i < Math.round((l.share / 100) * 20)
                                          ? LANG_COLOR[l.name] ?? "var(--color-cyan)"
                                          : "color-mix(in oklab, var(--color-violet) 20%, transparent)",
                                    }}
                                  />
                                ))}
                              </div>
                            </td>
                            <td className="py-2.5 pl-4 text-right">
                              <span className="font-display text-[11px] font-bold tabular-nums text-ink-dim">
                                {l.share}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  <p className="mt-5 text-sm leading-relaxed text-ink-faint">
                    Share of public repositories by primary language. On GitHub since{" "}
                    {data.since}.
                  </p>
                </div>
              </Reveal>

              {/* Repos */}
              <Reveal delay={0.06}>
                <div className="panel h-full p-6">
                  <div className="flex items-baseline justify-between border-b border-violet/30 pb-3">
                    <h3 className="hud text-magenta">Repositories</h3>
                    <span className="pixel">Recent</span>
                  </div>

                  <ul>
                    {data.top.map((repo) => (
                      <li key={repo.id} className="border-b border-violet/20">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          data-cursor="open"
                          className="group block py-4"
                        >
                          <div className="flex items-baseline justify-between gap-4">
                            <span className="font-display text-sm font-black uppercase tracking-tight text-ink-hi transition-colors duration-300 group-hover:text-cyan">
                              {repo.name}
                            </span>
                            <span className="pixel shrink-0">{repo.language ?? "—"}</span>
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-ink-dim">
                            {repo.description ?? "No description provided."}
                          </p>
                        </a>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hud mt-5 inline-flex items-center gap-2 transition-colors duration-300 hover:text-cyan"
                    data-cursor="open"
                  >
                    <GithubMark className="h-3 w-3" />
                    All repositories
                  </a>
                </div>
              </Reveal>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
