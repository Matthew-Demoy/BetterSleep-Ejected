const currentEntries = (state = [], action) => {
    switch (action.type) {
        case 'COMPLETE_EXERCISE':
          console.log("activity - complete exercise")
          return Object.assign({}, state, {
            dailyExercise: true
        })
        case 'COMPLETE_NUTRITION':
          console.log("activity - complete exercise")
          return Object.assign({}, state, {
            dailyNutrition: true
        })
        case "ENTER_BED_TIME":
          console.log("activity - enter Bed Time")
          return Object.assign({}, state, {
            bedTime: action.bedTime
        })
      default:
      console.log("entry - no action")
        return state
    }
  }
  

export default currentEntries;