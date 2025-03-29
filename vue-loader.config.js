module.exports = {
  compilerOptions: {
    isCustomElement: tag => tag.startsWith('vue-')
  }
}
