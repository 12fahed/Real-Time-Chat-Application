export function formatDate(dateString){
    
    let formattedDate = dateString.split("T")[0].split("-")
    return `${formattedDate[2]}-${formattedDate[1]}-${formattedDate[0]}`;
}