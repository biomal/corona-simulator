class Ball {
  /** @type {number} */
  x = 0
  /** @type {number} */
  y = 0
  /** @type {number} */
  velX = random(-3, 3) || 1
  /** @type {number} */
  velY = random(-3, 3) || 1
  /** @type {number} */
  radius = 5
  /** @type {string} */
  color = 'cornflowerblue'
  /** @type {boolean} */
  stopped = false

  constructor(x, y) {
    this.x = x
    this.y = y
  }

  draw() {
    context.save()
    context.beginPath()
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    context.fillStyle = this.color
    context.fill()
    context.restore()
  }

  move() {
    if (this.stopped) return
    // Right bound collision
    if (this.x + this.velX > canvasWidth - this.radius)
      this.velX = -this.velX
    // Left bound collision
    else if (this.x + this.velX < this.radius)
      this.velX = -this.velX
    // Lower bound collision
    if (this.y + this.velY > canvasHeight - this.radius)
      this.velY = -this.velY
    // Upper bound collision
    else if (this.y + this.velY < this.radius)
      this.velY = -this.velY
    // Updating position
    this.x += this.velX
    this.y += this.velY
  }

  /**
   * Euclidean distance to another ball
   * @param {Ball} b2 
   */
  distanceTo(b2) {
    const x = this.x - b2.x
    const y = this.y - b2.y
    return Math.sqrt(x * x + y * y)
  }
}