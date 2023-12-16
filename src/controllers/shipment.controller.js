import ShipmentService from "../services/shipment.service";
import TransactionService from "../services/transaction.service";
import errorCode from "../constants/error.code";
import shipStatus from "../constants/ship.status";
import Shipment from "../models/shipment";
import helper from "../utils/helper";
import * as _ from "lodash";

export default class ShipmentController {
    constructor() { }
    create = async (req, res) => {
        try {
            const { body } = req;
            body.meta.cost = await ShipmentService.calculateCost(req.user.department,
                { province: body.receiver.province, district: body.receiver.district },
                body.weight);
            body.meta.start = Date.now();
            body.status = shipStatus.PREPARING;
            var shipment = await ShipmentService.create(body);

            const transaction_body = {
                shipment: shipment.toString(),
                start: Date.now(),
                end: Date.now() + 1000,
                receiver: req.user._id.toString(),
                des: req.user.department.toString(),
                status: shipStatus.RECEIVED
            };
            var transaction = await TransactionService.create(transaction_body);

            const payload = {
                shipment: shipment,
            };
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
            if (!transaction) await Shipment.findByIdAndDelete(shipment)

            return res.status(400).json({
                ok: false,
                errorCode: e.errorCode || errorCode.GENERAL_ERROR,
                message: e.message
            });
        }
    }

    // update_info = async (req, res) => {
    //     try {
    //         const { body, params } = req;
    //         var shipment = await ShipmentService.update(params.id, body);

    //         const payload = {
    //             shipment: shipment
    //         }
    //         return res.status(200).json({
    //             ok: true,
    //             errorCode: errorCode.SUCCESS,
    //             data: {
    //                 payload: {
    //                     ...payload
    //                 }
    //             }
    //         });
    //     } catch (e) {
    //         return res.status(400).json({
    //             ok: false,
    //             errorCode: e.errorCode || errorCode.GENERAL_ERROR,
    //             message: e.message
    //         });
    //     }
    // }

    nationwide_list = async (req, res) => {
        try {
            const { query } = req;
            var shipments = await ShipmentService.list(query);

            const payload = {
                shipments: shipments
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

    department_list = async (req, res) => {
        try {
            const { query, params } = req;
            var department;
            if (params.id) department = params.id;
            else department = req.user.department;
            
            var transactions_query = {};
            if (params.type === 'send') {
                transactions_query.pos = department
            } else {
                transactions_query.des = department
            }

            var transactions = await TransactionService.list(transactions_query, { shipment: 1 });
            var shipments = await ShipmentService.list(query, transactions.map(transaction => transaction.shipment));

            const payload = {
                shipments: shipments
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

    track = async (req, res) => {
        try {
            const { params } = req;
            var shipment = await ShipmentService.view(params.id);
            var transactions = await ShipmentService.track(params.id);

            const payload = {
                shipment: shipment,
                transactions: transactions
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