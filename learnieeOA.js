const arr = [1,2,4,5,6,8]
const range = [1, 10]

function findMissing(arr,range){

    const start = range[0]
    const end = range[1]

    const originalArray = []
    for(let i=start; i<=end; i++){
        originalArray.push(i)
    }

    console.log(originalArray)
    const result = []
    originalArray.forEach(element => {
        if(arr.indexOf(element)===-1){
            result.push(element)
        }
    });

    return result

}

console.log(findMissing(arr, range))