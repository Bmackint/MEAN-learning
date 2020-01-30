import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';
//async validator function
//'{[key: String]}' will have a key of type string (any/dynamic property name)
export const mimeType = (
    control: AbstractControl
): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
    if(typeof(control.value === 'string')){
        return of(null);
    }
    const file = control.value as File;
    const fileReader = new FileReader();
    //create observable
    const frObs = Observable.create((observer: Observer<{[key: string]: any}>)=> {
        fileReader.addEventListener("loadend", () => {
            const arr = new Uint8Array(<ArrayBuffer> fileReader.result).subarray(0, 4);
            let header = "";
            let isValid = false;
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }
            //identify file type
            console.log("type of file, header = ", header); //for debugging + informational
            switch (header) {
                case "89504e47":
                    isValid = true;
                    break;
                case "ffd8ffe0":

                    isValid = true;
                    console.log("in case: ffd8ffe0, isValid:", isValid);
                case "ffd8ffe1":
                case "ffd8ffe2":  
                case "ffd8ffe3":
                case "ffd8ffe8":  
                    isValid = true;
                    break;
                default: 
                    isValid = false;
                    break;
            }
            if (isValid) {
                observer.next(null); //emit null if valid filetype
            } else {
                observer.next({invalidMimeType: true}) //emit message if invalid file type
            }
            observer.complete(); // let subscribers know finished
        });
        fileReader.readAsArrayBuffer(file); //allow access MIME type
    });
    return frObs;
}