import Validator from "../utils/validator";
import helper from "../utils/helper";
import errorCode from "../constants/error.code";
import jwt from "jsonwebtoken";
import systemConfig from "config";
import ms from "ms";
import * as _ from "lodash";
import Staff from "../models/staff";
import Department from "../models/department";
import staffRole from "../constants/staff.role";
import departmentType from "../constants/department.type";

class StaffService {
    constructor() { }
    async create(req, res, next) {
        try {
            const { body } = req;

            // Validating fields type
            const { error } = Validator.staff_create(body);
            if (error) {
                return res.status(400).json({
                    ok: false,
                    errorCode: errorCode.PARAMS_INVALID,
                    message: error.details.map(x => x.message).join(", ")
                });
            }

            let userData = {
                password: helper.generateHash(body.password),
                name: body.name,
                gender: body.gender,
                email: body.email
            };

            // Validating role data
            if (req.payload.role === staffRole.BOSS) {
                if (body.role !== staffRole.POSTOFFICE_MANAGER && body.role !== staffRole.STORAGE_MANAGER) {
                    return res.status(400).json({
                        ok: false,
                        errorCode: errorCode.STAFF.PARAMS_INVALID
                    })
                }
            }
            if (req.payload.role === staffRole.POSTOFFICE_MANAGER) {
                if (body.role !== staffRole.POSTOFFICE_EMMPLOYEE) {
                    return res.status(400).json({
                        ok: false,
                        errorCode: errorCode.STAFF.PARAMS_INVALID
                    })
                }
            }
            if (req.payload.role === staffRole.STORAGE_MANAGER) {
                if (body.role !== staffRole.STORAGE_EMMPLOYEE) {
                    return res.status(400).json({
                        ok: false,
                        errorCode: errorCode.STAFF.PARAMS_INVALID
                    })
                }
            }
            userData.role = body.role;

            // Validating department data
            if (body.department && body.role !== staffRole.BOSS) {
                let department = await Department.findById(body.department);
                if (!department) {
                    return res.status(404).json({
                        ok: false,
                        errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_EXISTS
                    })
                }
                if (department.type === departmentType.STORAGE) {
                    if (!(body.role === staffRole.STORAGE_EMMPLOYEE || body.role === staffRole.STORAGE_MANAGER)) {
                        return res.status(400).json({
                            ok: false,
                            errorCode: errorCode.DEPARTMENT.PARAMS_INVALID
                        })
                    }
                }
                if (department.type === departmentType.POSTOFFICE) {
                    if (!(body.role === staffRole.POSTOFFICE_EMMPLOYEE || body.role === staffRole.POSTOFFICE_MANAGER)) {
                        return res.status(400).json({
                            ok: false,
                            errorCode: errorCode.DEPARTMENT.PARAMS_INVALID
                        })
                    }
                }
                if (department.active === false) {
                    return res.status(400).json({
                        ok: false,
                        errorCode: errorCode.DEPARTMENT.DEPARTMENT_NOT_ACTIVE
                    })
                }
                userData.department = body.department;
            }

            // Validating username data
            let user = await Staff.findOne({
                username: body.username
            });
            if (user) {
                return res.status(400).json({
                    ok: false,
                    errorCode: errorCode.REGISTER.USERNAME_EXISTS
                })
            }
            userData.username = body.username;

            // Create staff
            user = await Staff.create(userData);

            // Return response
            const payload = {
                username: user.username,
                role: user.role,
            }
            const token = jwt.sign(payload, systemConfig.get("secret"), {
                expiresIn: ms('1y')
            });
            res.status(200).json({
                ok: true,
                errorCode: errorCode.SUCCESS,
                data: {
                    token: `Bearer ${token}`,
                    payload: {
                        ...payload,
                        username: payload.username
                    }
                }

            });
        } catch (e) {
            console.log(e);
            return res.status(400).json({
                ok: false,
                errorCode: errorCode.GENERAL_ERROR,
                message: e.message
            })
        }
    }

    async view_document(req, res, next) {
        try {
            const { params } = req;

            const staff = await Staff.findOne({ username: params.id });
            if (!staff) {
                return res.status(404).json({
                    ok: false,
                    errorCode: errorCode.STAFF.STAFF_NOT_EXISTS
                });
            }
            
            // Return response
            const payload = {
                staff: staff
            }
            res.status(200).json({
                ok: true,
                errorCode: errorCode.SUCCESS,
                data: {
                    payload: {
                        ...payload
                    }
                }
            });
        } catch (e) {
            return res.status(500).json({
                ok: false,
                errorCode: errorCode.GENERAL_ERROR,
                message: e.message
            });
        }
    }

    async view_collection(req, res, next) {
        try {
            const { query } = req;
            const { error } = Validator.staff_update(query);
            if (error) {
                return res.status(404).json({
                    ok: false,
                    errorCode: errorCode.PARAMS_INVALID,
                    message: error.details.map(x => x.message).join(", ")
                });
            }

            const filter = {};
            if (query.username) filter.username = query.username;
            if (query.role) filter.role = query.role;
            if (query.department) filter.department = query.department;
            if (query.name) filter.name = query.name;
            if (query.gender) filter.gender = query.gender;
            if (query.email) filter.email = query.email;
            if (query.active !== undefined) filter.active = query.active;

            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const skip = (page - 1) * limit;

            const staffs = await Staff.find(filter).skip(skip).limit(limit);
            
            const payload = {
                staffs: staffs           
            }
            res.status(200).json({
                ok: true,
                errorCode: errorCode.SUCCESS,
                data: {
                    payload: {
                        ...payload
                    }
                }
            });
        } catch (e) {
            return res.status(500).json({
                ok: false,
                errorCode: errorCode.GENERAL_ERROR,
                message: e.message
            });
        }
    }
}

export default new StaffService();