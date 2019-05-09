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
      default:
      console.log("entry - no action")
        return state
    }
  }
  

export default currentEntries;