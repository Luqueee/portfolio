const studies = [
  {
    title:
      "CFGM (Intermediate Vocational Training) in Microcomputer Systems and Networks",
    years: [2023, 2025],
    description: (
      <span>
        I hold an Intermediate Vocational Diploma in Microcomputer Systems and
        Networks, a two-year technical program focused on the installation,
        maintenance, and administration of computer systems and local networks.
        The training covered hardware setup and repair, operating systems
        (Windows/Linux), network configuration, basic cybersecurity, and server
        management, along with a professional internship in the IT sector.
      </span>
    ),
  },
  {
    title: "Codelearn",
    years: [2016, 2022],
    description: (
      <span>
        I studied at a programming academy for around six years, where I built a
        strong foundation in software development and technology. During this
        time, I learned the basics of several programming languages and tools,
        including Python, HTML, CSS, JavaScript, SQLite, C++, Java, and C#. In
        addition to coding skills, the program also introduced me to key
        concepts in computer science and modern technologies, helping me develop
        a well-rounded technical background.
      </span>
    ),
  },
];
export const Studies = () => {
  return (
    <div className="w-full">
      <h3 className="text-4xl font-[700]">Studies</h3>
      <div className="w-full flex flex-col gap-4 mt-4">
        {studies.map((study, idx) => (
          <div
            key={idx}
            className="border border-zinc-800 hover:bg-zinc-800/30 bg-zinc-900/10 backdrop-blur-md focus:bg-zinc-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <h4 className="text-xl font-semibold">{study.title}</h4>
            <p className="text-sm text-zinc-400">{study.years.join(" - ")}</p>

            <p className="mt-2 text-zinc-300 text-balance">
              {study.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
