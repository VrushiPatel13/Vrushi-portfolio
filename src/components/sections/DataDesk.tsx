import { profile } from "@/lib/data";
import { SectionHead } from "@/components/ui/SectionHead";
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

    const since = new Date(user.created_at).getFullYear();

    return { user, stars, forks, languages, top, repoCount: own.length, since };
  } catch {
    return null;
  }
}

/* -------------------------------- section -------------------------------- */

export async function DataDesk() {
  const data = await getGithub();
  const profileUrl = `https://github.com/${profile.githubUser}`;

  return (
    <section id="numbers" className="section-pad relative">
      <div className="shell">
        <SectionHead
          num="04"
          department="Data Desk"
          label="By the Numbers"
          headline="The public record."
          lede="Read live from the GitHub API and refreshed hourly. If the numbers look modest, that's because they're real."
        />

        {!data ? (
          <Reveal>
            <div className="mt-12 flex flex-col items-start justify-between gap-5 border-y border-rule py-8 sm:flex-row sm:items-center">
              <div>
                <p className="font-display text-lg font-bold text-ink-hi">
                  Live figures unavailable
                </p>
                <p className="mt-1.5 font-serif text-[0.9375rem] text-ink-dim">
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
            {/* Figures */}
            <Reveal>
              <dl className="mt-12 grid grid-cols-2 gap-px border border-rule bg-rule lg:grid-cols-4">
                {[
                  { label: "Public repositories", value: data.repoCount },
                  { label: "Stars earned", value: data.stars },
                  { label: "Forks", value: data.forks },
                  { label: "Followers", value: data.user.followers },
                ].map((f) => (
                  <div key={f.label} className="bg-paper px-5 py-7">
                    <dt className="label">{f.label}</dt>
                    <dd className="mt-3 font-display text-[clamp(2rem,4vw,2.75rem)] font-black leading-none tabular-nums text-ink-hi">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Language table */}
              <Reveal>
                <div>
                  <div className="flex items-baseline justify-between border-b border-rule pb-3">
                    <h3 className="font-display text-lg font-bold">Language mix</h3>
                    <span className="label">@{profile.githubUser}</span>
                  </div>

                  {data.languages.length === 0 ? (
                    <p className="mt-5 font-serif text-[0.9375rem] text-ink-dim">
                      No language data published yet.
                    </p>
                  ) : (
                    <table className="mt-2 w-full">
                      <caption className="sr-only">
                        Share of repositories by primary language
                      </caption>
                      <thead>
                        <tr className="border-b border-rule">
                          <th scope="col" className="label py-2.5 text-left font-medium">
                            Language
                          </th>
                          <th scope="col" className="label py-2.5 text-right font-medium">
                            Share
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.languages.map((l) => (
                          <tr key={l.name} className="border-b border-rule">
                            <th
                              scope="row"
                              className="py-3.5 text-left font-serif text-[0.9375rem] font-normal text-ink"
                            >
                              {l.name}
                            </th>
                            <td className="py-3.5">
                              <div className="flex items-center justify-end gap-4">
                                <span
                                  aria-hidden
                                  className="hidden h-px bg-accent sm:block"
                                  style={{ width: `${Math.max(4, l.share * 0.9)}%` }}
                                />
                                <span className="font-mono text-[11px] tabular-nums text-ink-dim">
                                  {l.share}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  <p className="mt-4 font-serif text-sm leading-relaxed text-ink-mute">
                    Share of public repositories by primary language. Active on GitHub
                    since {data.since}.
                  </p>
                </div>
              </Reveal>

              {/* Repositories */}
              <Reveal delay={0.06}>
                <div>
                  <div className="flex items-baseline justify-between border-b border-rule pb-3">
                    <h3 className="font-display text-lg font-bold">Repositories</h3>
                    <span className="label">Most recent</span>
                  </div>

                  <ul>
                    {data.top.map((repo) => (
                      <li key={repo.id} className="border-b border-rule">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          data-cursor="open"
                          className="group block py-4"
                        >
                          <div className="flex items-baseline justify-between gap-4">
                            <span className="font-display text-base font-bold text-ink-hi transition-colors duration-300 group-hover:text-accent">
                              {repo.name}
                            </span>
                            <span className="label shrink-0">
                              {repo.language ?? "—"}
                            </span>
                          </div>
                          <p className="mt-1.5 font-serif text-sm leading-relaxed text-ink-dim">
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
                    className="label mt-5 inline-flex items-center gap-2 transition-colors duration-300 hover:text-accent"
                    data-cursor="open"
                  >
                    <GithubMark className="h-3 w-3" />
                    Every repository on GitHub
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
