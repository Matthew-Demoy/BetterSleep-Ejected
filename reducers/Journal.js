const currentEntries = (state = [], action) => {
    switch (action.type) {
      case 'ADD_ENTRY':
        console.log("entry added")

        updateEntries = [{
          journal: action.entry.journal,
          didExercise: action.entry.didExercise,
          didNutrition: action.entry.didNutrition,
          grade: action.entry.grade,
          date: action.entry.date,
          id: action.entry.id
        }, ...state.entries]
        
        updateEntries.sort(function(a,b){
          console.log("sort")
          console.log(b.date)
          console.log(a.date)
          return new Date(b.date) - new Date(a.date) })

        return Object.assign({}, state, {
          entries: updateEntries,
          dailyExercise: false,
          dailyNutrition: false
        })
      case 'EDIT_ENTRY':
        console.log("entry edited")
        const temp = state.entries
        index = temp.findIndex(obj => obj.id === action.entry.id);
        temp[index] = {
          journal: action.entry.journal,
          didExercise: action.entry.didExercise,
          didNutrition: action.entry.didNutrition,
          grade: action.entry.grade,
          date: action.entry.date,
          id: action.entry.id
        }

        temp.sort(function(a,b){
          console.log("sort")
          return new Date(b.date) - new Date(a.date) })
          console.log(temp)
        return Object.assign({}, state, {
          entries: [
            ...temp
          ]
        })
        case 'DELETE_ENTRY':
        console.log("entry deleted")

        filteredState = state.entries.filter(obj => {

          return !(action.entry.id === obj.id)
        })
        return Object.assign({}, state, {
          entries: [
            ...filteredState
          ]
        })
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