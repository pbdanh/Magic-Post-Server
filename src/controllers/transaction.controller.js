import TransactionService from "../services/transaction.service";
import errorCode from "../constants/error.code";
import shipStatus from "../constants/ship.status";
import Department from "../models/department";
import transactionType from "../constants/transaction.type";
import departmentType from "../constants/department.type";
import staffRole from "../constants/staff.role";
import Shipment from "../models/shipment";
import Transaction from "../models/transaction";

export default class TransactionController {
    constructor() { }
    list = async (req, res) => {
        try {
            const { query, params } = req;
            query.type = params.type;
            query[params.view] = req.user.department;

            var transactions = await TransactionService.list(query);

            const payload = {
                ...transactions
            }
            return res.status(200).json({
                ok: true,
                errorCode: errorCode.SUCCESS,
                data: {
                    payload: {
                        ...payload
                    }
                }
            });
        } catch (e) {
            return res.status(400).json({
                ok: false,
                errorCode: e.errorCode || errorCode.GENERAL_ERROR,
                message: e.message
            });
        }
    }

    push = async (req, res) => {
        try {
            const { body, params } = req;

            const postoffice = await Department.findById(req.user.department);
            for (const element of body) {
                element.type = params.type;
                element.sender = req.user.username.toString();
                element.start = Date.now();
                element.pos = postoffice._id.toString();
                element.status = shipStatus.SENT;

                var shipment = await Shipment.findById(element.shipment);

                if (element.type === transactionType.PtS) {
                    // Post-office to Storage
                    element.des = postoffice.cfs.toString();
                    shipment.status = shipStatus.DELIVERING;
                    await shipment.save();
                }

                if (element.type === transactionType.StS) {
                    // Storage to storage
                    let department = await Department.findOne({
                        type: departmentType.STORAGE,
                        province: shipment.receiver.province
                    });
                    element.des = department._id.toString();
                    if (element.des === element.pos) {
                        element.type === transactionType.StP;
                    }
                }

                if (element.type === transactionType.StP) {
                    // Storage to Post-office
                    let department = await Department.findOne({
                        type: departmentType.POSTOFFICE,
                        province: shipment.receiver.province,
                        district: shipment.receiver.district
                    });
                    element.des = department._id.toString();
                }

                await Transaction.findOneAndUpdate(
                    {
                        shipment: shipment._id,
                        des: postoffice._id,
                    },
                    {
                        status: shipStatus.PASSED
                    }
                );
            };

            var transactions = await TransactionService.create(body);

            const payload = {
                ...transactions
            }
            return res.status(200).json({
                ok: true,
                errorCode: errorCode.SUCCESS,
                data: {
                    payload: {
                        ...payload
                    }
                }
            });
        } catch (e) {
            return res.status(400).json({
                ok: false,
                errorCode: e.errorCode || errorCode.GENERAL_ERROR,
                message: e.message
            });
        }
    }

    update = async (req, res) => {
        try {
            const { body, params } = req;

            if (params.type === transactionType.PtC) {
                // Update shipment status
                let shipments = await Transaction.distinct('shipment', { _id: { $in: body.ids } });
                await Shipment.updateMany({ _id: { $in: shipments } }, { status: body.data.status })
            }

            body.data.receiver = req.user.username;
            body.data.end = Date.now();
            var transactions = await TransactionService.update_many(body.ids, body.data);

            const payload = {
                ...transactions
            }
            return res.status(200).json({
                ok: true,
                errorCode: errorCode.SUCCESS,
                data: {
                    payload: {
                        ...payload
                    }
                }
            });
        } catch (e) {
            return res.status(400).json({
                ok: false,
                errorCode: e.errorCode || errorCode.GENERAL_ERROR,
                message: e.message
            });
        }
    }
}