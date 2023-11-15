import Joi from "joi";
import staffRole from "../constants/staff.role"
import departmentType from "../constants/department.type"

class Validator {
    auth_login = (body) => {
        return Joi.object()
        .keys({
            username: Joi.string().required(),
            password: Joi.string().required()
        })
        .validate(body);
    }

    staff_create = (body) => {
        const roleValues = Object.values(staffRole);
        const staffSchema = Joi.object().keys({
            username: Joi.string().required(),
            password: Joi.string().required(),
            role: Joi.string().valid(...roleValues).required(),
            department: Joi.string(),
            name: Joi.string().required(),
            gender: Joi.string().valid("Male", "Female", "Other").required(),
            email: Joi.string().email().required()
        });
        return staffSchema.validate(body);
    }
    staff_update = (body) => {
        const roleValues = Object.values(staffRole);
        const staffSchema = Joi.object().keys({
            username: Joi.string(),
            password: Joi.string(),
            role: Joi.string().valid(...roleValues),
            department: Joi.string(),
            name: Joi.string(),
            gender: Joi.string().valid("Male", "Female", "Other"),
            email: Joi.string().email(),
            active: Joi.boolean()
        });
        return staffSchema.validate(body);
    }

    department_create = (body) => {
        const typeValues = Object.values(departmentType);
        const departmentSchema = Joi.object().keys({
            province: Joi.string().required(),
            district: Joi.string().required(),
            street: Joi.string().required(),
            type: Joi.string().valid(...typeValues).required(),
            cfs: Joi.string(),
            zipcode: Joi.string()
        });
        return departmentSchema.validate(body);
    }
    department_update = (body) => {
        const typeValues = Object.values(departmentType);
        const departmentSchema = Joi.object().keys({
            province: Joi.string(),
            district: Joi.string(),
            street: Joi.string(),
            type: Joi.string().valid(...typeValues),
            cfs: Joi.string(),
            zipcode: Joi.string(),
            active: Joi.boolean()
        });
        return departmentSchema.validate(body);
    }
}
export default new Validator();