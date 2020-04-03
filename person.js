class Person extends Ball {
  /** @type {number} */
  id = 0
  /** @type {'healthy' | 'sick' | 'healed' | 'dead'} */
  healthStatus = 'healthy'
  /** @type {number} */
  contagionMoment

  drawId() {
    const x = this.x + this.radius
    const y = this.y + this.radius
    context.save()
    context.beginPath()
    context.font = '8px'
    context.fillText(this.id, x, y)
    context.restore()
  }

  healthStatusColor() {
    switch (this.healthStatus) {
      case 'healthy':
        this.color = '#64dd17'
        break
      case 'sick':
        this.color = '#f44336'
        break
      case 'healed':
        this.color = '#1e88e5'
        break
      case 'dead':
        this.color = '#424242'
        break
    }
  }

  draw() {
    this.healthStatusColor()
    this.drawId()
    super.move()
    super.draw()
  }
}