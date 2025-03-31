import { Hero } from '@/components/layout/hero'

export default function AboutPage() {
  return (
    <>
      <Hero showWelcome={false} />
      <div className='relative container mx-auto max-w-6xl px-4 py-24 mt-[-340px] md:mt-[-380px]'>
        <h1 className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text'>
          About Me
        </h1>

        <div className='prose prose-sm md:prose-base dark:prose-invert max-w-none mt-8 space-y-2'>
          <p>
            Hello! I'm a seasoned software developer with many years of experience in the tech
            industry. Throughout my journey, I've worked with various technologies and frameworks,
            solving complex problems and building scalable solutions.
          </p>

          <p>
            I created this blog as a platform to share my thoughts, experiences, and insights gained
            from years of working in software development. Here, you'll find articles about:
          </p>

          <ul className='list-disc pl-6 mb-6'>
            <li>Technical tutorials and guides</li>
            <li>Best practices in software development</li>
            <li>Lessons learned from real-world projects</li>
            <li>Industry trends and observations</li>
            <li>Career advice for fellow developers</li>
          </ul>

          <p>
            My goal is to contribute to the developer community by sharing knowledge and experiences
            that might help others in their professional journey. Whether you're a seasoned
            developer or just starting out, I hope you'll find valuable insights in my posts.
          </p>

          <p>
            Feel free to explore the blog and reach out if you have any questions or would like to
            discuss anything related to software development.
          </p>

          <p className='text-lg font-bold !mt-8'>Nguyen Nguyen</p>
        </div>
      </div>
    </>
  )
}
