/**
 * Methods need to be as specific to business process as possible
 */
class RepositoryInterface {
  

  /**
   * 
   * @param {*} filter 
   */
  async findAll(filter={}) {
    // implementation
  }

  async findById(id) {
    // implementation
  }
}

module.exports = {
  RepositoryInterface
}