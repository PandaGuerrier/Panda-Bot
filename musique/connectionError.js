module.exports = {
  name: 'connectionError',
    async execute(queue, track) {
      console.log("Oops, quelque chose se passe mal avec la connection du serveur, veuillez réessayer plus tard !")
  }
}