export default function CreditsPage() {
  const team = [
    {
      name: "Kento Kanehira",
      role: "Full-Stack Developer",
      linkedIn: "https://www.linkedin.com/in/kento-kanehira-ixx/",
      gitHub: "https://github.com/kento-ix",
    },
    {
      name: "Vorleak Yek",
      role: "Full-Stack Developer",
      linkedIn: "https://www.linkedin.com/in/vorleakyek/",
      gitHub: "https://github.com/vorleakyek",
    },
    {
      name: "Xochitl Farias",
      role: "Product Owner",
      linkedIn: "https://www.linkedin.com/in/xfarias-scrum-master/",
      gitHub: "https://github.com/xochfa",
    },
    {
      name: "Jessica Hackett",
      role: "UX Designer",
      linkedIn: "https://www.linkedin.com/in/jessica-hackett",
      gitHub: "https://github.com/mooglemoxie0018",
    },
  ];

  return (
    <section className="flex flex-grow bg-[#F0E7FF] py-12">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Team Project Credits
        </h2>
        <p className="text-gray-600 mb-12">
          Special thanks to our amazing team for their collaboration and
          dedication.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition-shadow"
            >
              <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-4 text-purple-600 font-bold text-2xl">
                {member.name[0]}
              </div>

              <h3 className="text-lg font-semibold text-gray-800">
                {member.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1 mb-3">{member.role}</p>

              <div className="flex gap-4 text-blue-600 font-medium">
                {member.gitHub && (
                  <a
                    href={member.gitHub}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-blue-800 transition-colors"
                  >
                    GitHub
                  </a>
                )}
                {member.linkedIn && (
                  <a
                    href={member.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-blue-800 transition-colors"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-gray-400 text-sm mt-12">
          © {new Date().getFullYear()} PRTrackr Team
        </p>
      </div>
    </section>
  );
}
