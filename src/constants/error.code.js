export default {
    LOGIN: {
        USER_NOT_FOUND: {
            errorCode: "USER_NOT_FOUND",
            message: "User not found"
        },
        USED_EXPIRED: {
            errorCode: "USED_EXPIRED",
            message: "Account expired"
        },
        PASSWORD_INVALID: {
            errorCode: "PASSWORD_INVALID",
            message: "Incorrect password"
        },
        LOCK_LOGIN: {
            errorCode: "LOCK_LOGIN",
            message: "Incorrect password entered more than 5 times."
        }
    },
    REGISTER: {
        USERNAME_EXISTS: {
            errorCode: "USERNAME_EXISTS",
            message: "Username already exists"
        }
    },
    AUTH: {
        TOKEN_NOT_FOUND: {
            errorCode: "TOKEN_NOT_FOUND",
            message: "Login required"
        },
        TOKEN_EXPIRED: {
            errorCode: "TOKEN_EXPIRED",
            message: "Token expired"
        },
        TOKEN_INVALID: {
            errorCode: "TOKEN_INVALID",
            message: "Token cannot be authenticated"
        },
        ROLE_INVALID: {
            errorCode: "ROLE_INVALID",
            message: "Your role does not have permission for this function"
        },
        USER_EXPIRED: {
            errorCode: "USER_EXPIRED",
            message: "Account has expired"
        },
        USER_DELETED: {
            errorCode: "USER_DELETED",
            message: "Account has been deleted from the system"
        },
        TOKEN_BLOCKED: {
            errorCode: "TOKEN_BLOCKED",
            message: "Account has just changed the password or has been kicked"
        }
    },
    CHANGE_PASSWORD: {
        USER_NOT_EXISTS: {
            errorCode: "USER_NOT_EXISTS",
            message: "Account does not exist or has been deleted"
        },
    },
    GET_INFO: {
        USER_NOT_EXISTS: {
            errorCode: "USER_NOT_EXISTS",
            message: "Account does not exist or has been deleted"
        },
    },
    UPDATE_USER_FOR_FAST_REGISTER: {
        UPDATE_FAIL: {
            errorCode: "UPDATE_FAIL",
            message: "Failed to update account information (username/password)"
        },
        NEW_USERNAME_EXISTS: {
            errorCode: "NEW_USERNAME_EXISTS",
            message: "New username already exists"
        }
    },

    STAFF: {
        PARAMS_INVALID: {
            errorCode: "PARAMS_INVALID",
            message: "Staff role is invalid"
        }
    },

    DEPARTMENT: {
        PARAMS_INVALID: {
            errorCode: "PARAMS_INVALID",
            message: "Department type is invalid"
        },
        PARAMS_MISSING: {
            errorCode: "PARAMS_MISSING",
            message: "Department zipcode or cfs is missing"
        },
        DEPARTMENT_NOT_EXISTS: {
            errorCode: "DEPARTMENT_NOT_EXISTS",
            message: "Department ID is invalid"
        },
        DEPARTMENT_REF_CONSTRAINT: {
            errorCode: "DEPARTMENT_REF_CONSTRAINT",
            message: "Can not delete department that is referenced by the others"
        },
        DEPARTMENT_NOT_ACTIVE: {
            errorCode: "DEPARTMENT_NOT_ACTIVE",
            message: "Department need to be activated first"
        }
    },
    
    GENERAL_ERROR: "GENERAL_ERROR",
    SUCCESS: "SUCCESS",
    PARAMS_INVALID: "PARAMS_INVALID"
}
