/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas')
const canvasWidth = canvas.width
const canvasHeight = canvas.height

/** @type {CanvasRenderingContext2D} */
const context = canvas.getContext('2d')

/** @type {HTMLInputElement} */
const inputHowManyPeople = document.getElementById('howManyPeople')

/** 
 * Returns an integer between min and max
 * @returns {number} 
 */
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

/** @type {Person[]} */
const people = []
let howManyPeople = inputHowManyPeople.value

let started = false

let frame = 0
const framesPerDay = 200

let day = 1
let peopleHealthy = 0
let peopleSick = 0
let peopleHealed = 0
let peopleDead = 0

const daysToHealOrDie = 14
const variationOfDaysToHealOrDie = 2

const quarentinedRate = 80
const contagionDistance = 5
const contagionRate = 90
const deathRate = 5

const updateFramesAndDays = () => {
  frame++
  day = Math.floor(frame / framesPerDay) + 1
  document.getElementById('day-count').innerText = day
}

/** @param {'healthy' | 'sick' | 'healed' | 'dead'} whichStats */
const updatePeopleStats = (whichStats) => {
  // Updating people health status
  switch (whichStats) {
    case 'healthy':
      peopleHealthy++
      break
    case 'sick':
      peopleHealthy--
      peopleSick++
      break
    case 'healed':
      peopleSick--
      peopleHealed++
      break
    case 'dead':
      peopleSick--
      peopleDead++
      break
  }
  document.getElementById('healthy-count').innerText = peopleHealthy
  document.getElementById('sick-count').innerText = peopleSick
  document.getElementById('healed-count').innerText = peopleHealed
  document.getElementById('dead-count').innerText = peopleDead
}

/** @param {Person} p1 */
const simulateContagion = (p1) => {
  people.forEach(p2 => {
    if (p1 === p2) return
    if (p1.healthStatus !== 'sick') return
    if (p2.healthStatus !== 'healthy') return
    // Distance between a sick person (p1) to another person (p2)
    const distance = p1.distanceTo(p2)
    // If p1 is close enough to infect p2
    if (distance <= contagionDistance) {
      console.log(`p${p1.id} is close enough to infect p${p2.id}`)
      // P2 will be sick with a contagionRate % of chance
      if (random(0, 100) <= contagionRate) {
        console.log(`p${p1.id} infected p${p2.id}`)
        p2.healthStatus = 'sick'
        p2.contagionMoment = frame
        updatePeopleStats('sick')
      } else {
        console.log(`p${p1.id} did not infected p${p2.id}`)
      }
    }
  })
}

/** @param {Person} person */
const simulateVirusReaction = (person) => {
  if (person.healthStatus !== 'sick') return
  const daysToHealOrDieInFrames = daysToHealOrDie * framesPerDay
  const variationInFrames = variationOfDaysToHealOrDie * framesPerDay
  const variation = random(-variationInFrames, variationInFrames)
  const framesToReact = person.contagionMoment + daysToHealOrDieInFrames + variation
  // When the sick person has the virus long enough to react
  if (frame >= framesToReact) {
    // This person will die with a deathRate % of chance
    if (random(0, 100) <= deathRate) {
      console.log(`p${person.id} died`)
      person.healthStatus = 'dead'
      person.stopped = true
      updatePeopleStats('dead')
    } else {
      console.log(`p${person.id} healed`)
      person.healthStatus = 'healed'
      updatePeopleStats('healed')
    }
  }
}

const draw = async () => {
  // loop conditional
  if (started && peopleSick > 0)
    requestAnimationFrame(draw)
  context.clearRect(0, 0, canvas.width, canvas.height)
  updateFramesAndDays()
  people.forEach(person => {
    simulateContagion(person)
    simulateVirusReaction(person)
    person.draw()
  })
}

const start = () => {
  howManyPeople = inputHowManyPeople.value
  for (let i = 0; i < howManyPeople; i++) {
    const x = random(5, canvas.width - 5)
    const y = random(5, canvas.height - 5)
    const person = new Person()
    const quarentined = random(0, 100) <= quarentinedRate
    person.id = i + 1
    person.x = x
    person.y = y
    person.stopped = quarentined
    people.push(person)
    updatePeopleStats('healthy')
  }

  const firstCase = people[0]
  firstCase.healthStatus = 'sick'
  firstCase.contagionMoment = 1
  firstCase.stopped = false
  updatePeopleStats('sick')

  started = true
  draw()
}

const hdpiFix = () => {
  const pixelRatio = devicePixelRatio
  const width = canvas.width
  const height = canvas.height
  canvas.width = width * pixelRatio
  canvas.height = height * pixelRatio
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  context.scale(2, 2)
}
hdpiFix()