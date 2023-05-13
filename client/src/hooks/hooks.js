import {useEffect, useState} from "react";

export const useValidation = (value, validations) => {
    const [isEmpty, setEmpty] = useState(true);
    const [minLengthError, setMinLengthError] = useState(false);
    const [maxLengthError, setMaxLengthError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [inputValid, setInputValid] = useState(false)

    useEffect(() => {
        for (const validation in validations) {
            switch (validation) {
                case 'isEmpty':
                    if(value) {
                        setEmpty(false)
                    } else {
                        setEmpty(true)
                        setErrorMessage("Поле не может быть пустым")
                    }

                    break;
                case 'minLength':
                    if(value.length < validations[validation]) {
                        setMinLengthError(true)
                        setErrorMessage("Неккоректная длина")
                    } else {
                        setMinLengthError(false);
                    }

                    break;
                case 'maxLength':
                    if(value.length > validations[validation]) {
                        setMaxLengthError(true);
                        setErrorMessage("Слишком длинный пароль")
                    } else {
                        setMaxLengthError(false);
                    }
                    break;

                case "isEmail":
                    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    if(re.test(String(value).toLowerCase())) {
                        setEmailError(false)
                    } else {
                        setEmailError(true)
                        setErrorMessage("Неккоректная почта")
                    }
                    break;
            }
        }
    }, [value])

    useEffect(() => {
        if(isEmpty || minLengthError || maxLengthError || emailError) {
            setInputValid(false);
        } else {
            setInputValid(true);
        }
    }, [isEmpty, minLengthError, maxLengthError, emailError])
    return {
        isEmpty,
        minLengthError,
        maxLengthError,
        emailError,
        errorMessage,
        inputValid
    }
}

export const useInput = (initialValue, validation) => {
    const [value, setValue] = useState(initialValue);
    const [isDirty, setDirty] = useState(false);
    const valid = useValidation(value, validation);
    const onChange = (e) => {
        setValue(e.target.value);
    }

    const refresh = () => {
        setValue("");
        setDirty(false);
    }

    const onBlur = () => {
        setDirty(true);
    }

    return {
        value,
        onChange,
        onBlur,
        refresh,
        isDirty,
        ...valid,
    }
}

export const useSecondPassword = () => {

}