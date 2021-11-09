import { FormControl, ValidationErrors } from "@angular/forms";

export class ShopValidators {
    static noOnlyWhiteSpaces(formControl:FormControl):ValidationErrors{
        if((formControl.value != null) && (formControl.value.trim().length === 0)){
            return { 'noOnlyWhiteSpaces':true};
        }
        else{
            return null;
        }

        
    }
}
