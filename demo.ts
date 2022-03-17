import a from 'axios'

async function main() {
  const axios = a.create({
    baseURL: 'http://localhost:8000/api',
  })

  await axios.post('/users/signup', {
    name: 'Proctor',
    email: 'proctor@cit.edu',
    role: 'PROCTOR',
    password: '123',
  })

  await axios.post('/users/signup', {
    name: 'Examinee',
    email: 'examinee@cit.edu',
    role: 'Examinee',
    password: '123',
  })

  await axios.post('/classes', {
    name: 'Introduction to Computing',
    section: 'F1',
    proctorId: 1,
    courseCode: 'CS312',
  })
}

main()
