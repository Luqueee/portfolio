const contests = [
  {
    title: "Codejam",
    years: [2024, 2025],
    location: "Institut Sabadell",
    description: (
      <>
        <p>
          I have participated in several editions of Codejam, a programming
          competition organized by my institute and hosted on a custom platform
          called Jo-el. Although the competition is designed for teams of three
          at the advanced level, I chose to take on the challenge solo in two
          editions.
        </p>
        <p>
          Codejam brings together students from different institutes, including
          those from Barcelona, fostering a dynamic and competitive environment.
          It was a great opportunity to test my problem-solving skills and push
          my limits in real-world programming challenges.
        </p>
      </>
    ),
  },
  {
    title: "HP CodeWars",
    years: [2024, 2025],
    results: ["?", "14 / 130"],
    location: "HP Inc - Sant Cugat",
    description: (
      <>
        <p>
          I also took part in HP CodeWars, a national programming competition
          held in Sant Cugat and organized by Hewlett-Packard (HP). The event
          brought together over 130 teams from all over Spain, creating a highly
          competitive and inspiring atmosphere.
        </p>
        <p>
          Our team achieved an impressive 14th place, standing out among many
          talented participants. The top prize was an invitation to compete
          internationally at HP&#39;s headquarters in Houston, Texas, making the
          experience even more exciting and motivating.
        </p>
      </>
    ),
  },
];

export function Contests() {
  return (
    <div className="w-full">
      <h3 className="text-4xl font-[700]">Contests</h3>
      <div className="w-full flex flex-col gap-4 mt-4">
        {contests.map((contest, idx) => (
          <div
            key={idx}
            className="border border-zinc-800 hover:bg-zinc-800/30 bg-zinc-900/10 backdrop-blur-md focus:bg-zinc-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <h4 className="text-xl font-semibold">{contest.title}</h4>
            <p className="text-sm text-zinc-400">
              {contest.years.join(" - ")} | {contest.location}
            </p>
            {contest.results && (
              <p className="text-sm text-zinc-400">
                Results: {contest.results.join(" | ")}
              </p>
            )}
            <div className="mt-2 text-zinc-300 text-balance flex flex-col gap-2">
              {contest.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
