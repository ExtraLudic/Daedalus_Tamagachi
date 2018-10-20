module.exports = function(controller) {
  
  controller.logger = {
    info: (data) => console.log(data), 
    error: (err) => console.log(err)
  }
  
}