import a from 'axios'
import { faker } from '@faker-js/faker'

const ROUNDS = 10
const PLATFORMS = ['TEAMS', 'GOOGLE_FORMS', 'MOODLE']
const ACTIVITY = [
  'SWITCHED_TAB',
  'LOSE_WINDOW_FOCUS',
  'WENT_INCOGNITO',
  'ACCESSED_SITE',
  'USED_SEARCH_ENGINE',
  'FINISHED_EXAM_FAST',
  'ENTERED_EXAM_LATE',
  'FINISHED_EXAM',
  'WENT_IDLE',
]

const CLASS_NAMES = [
  'Distributed Systems',
  'Software Engineering',
  'Discrete Mathematics',
  'Special Topics',
  'Intro to Computer Science',
  'Intro to Programming',
  'Programming Languages',
  'Object Oriented Programming',
  'Data Structures',
  'Algorithms',
  'Operating Systems',
  'Computer Architecture',
  'Computer Networks',
  'Computer Graphics',
  'Computer Vision',
  'Multimedia',
  'Mobile Development',
  'Web Development',
  'Ethics',
  'Understanding the Self',
  'Purposive Communication',
  'Industry Trends',
  'Modern Tools',
  'Differential Calculus',
  'Precalculus',
  'Mechatronics',
  'Chemistry',
  'Physics',
  'Science Technology and Society',
  'Quantitative Methods',
  'Research Methods',
]

async function main() {
  const axios = a.create({
    baseURL: 'http://localhost:8000/api',
  })

  const codeList: string[] = []
  // create proctor
  await axios.post('/users/signup', {
    name: 'Proctor',
    email: 'proctor@cit.edu',
    role: 'PROCTOR',
    password: '123',
  })

  //create examinees
  for (let i = 1; i <= ROUNDS; i++) {
    const name = faker.name.findName()
    const email = faker.internet.email()
    const role = 'EXAMINEE'
    const password = '123'

    await axios.post('/users/signup', { name, email, role, password })
  }

  // create fake classes
  for (let i = 1; i <= ROUNDS; i++) {
    const proctorId = 1
    const name = CLASS_NAMES[Math.floor(Math.random() * CLASS_NAMES.length)]
    const section = `${faker.random.alpha({ upcase: true })}${Math.floor(
      Math.random() * ROUNDS,
    )}`
    const courseCode = `${faker.random.alpha({
      upcase: true,
      count: 2,
    })}${faker.datatype.number({ min: 100, max: 999 })}`

    const {
      data: { code },
    } = await axios.post('/classes', { name, section, proctorId, courseCode })
    codeList.push(code)
  }

  // create fake exams
  for (let i = 0; i < ROUNDS; i++) {
    const classId = Math.floor(Math.random() * ROUNDS) + 1
    const link = faker.internet.url()
    const name = `Exam ${Math.floor(Math.random() * ROUNDS)}`
    const description = faker.lorem.paragraph()
    const platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)]
    const startTime = faker.date.past()
    const endTime = faker.date.future()

    await axios.post('/exams', {
      classId,
      link,
      name,
      description,
      platform,
      startTime,
      endTime,
    })
  }

  // create fake enrolment
  for (let i = 0; i < ROUNDS * 5; i++) {
    const examineeId = Math.floor(Math.random() * ROUNDS) + 1
    const code = codeList[Math.floor(Math.random() * codeList.length)]

    try {
      await axios.post('/classes/enrol', { code, examineeId })
    } catch {
      i--
    }
  }

  // create fake activities
  for (let i = 0; i < ROUNDS * ROUNDS; i++) {
    const examId = Math.floor(Math.random() * ROUNDS) + 1
    const examineeId = Math.floor(Math.random() * ROUNDS) + 1
    const name = ACTIVITY[Math.floor(Math.random() * ACTIVITY.length)]
    const isSuspicious = name !== 'FINISHED_EXAM'
    const description = faker.lorem.sentence()

    await axios.post('/activities', {
      examId,
      examineeId,
      name,
      isSuspicious,
      description,
    })
  }
}

main()
