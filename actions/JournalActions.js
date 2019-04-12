
export function AddEntry (journal, didExercise, didNutrition, grade, date, id) {
    return {
        type: "ADD_ENTRY",
        entry: {
            journal: journal,
            didExercise: didExercise,
            didNutrition: didNutrition,
            grade: grade,
            date: date,
            id: id
        }
    }
}

export function EditEntry (journal, didExercise, didNutrition, grade, date, itemId) {
    return {
        type: "EDIT_ENTRY",
        entry: {
            journal: journal,
            didExercise: didExercise,
            didNutrition: didNutrition,
            grade: grade,
            date: date,
            id: itemId
        }
    }
}

export function DeleteEntry(itemId) {
    console.log(itemId)
    return{
        type: "DELETE_ENTRY",
        entry: {
            id: itemId
        }
    }
}