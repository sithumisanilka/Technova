import React from 'react';
import { APPOINTMENT_STATUS } from '../../constants/apiConfig';

const StatusBadge = ({ status }) => {
    const getStatusClass = () => {
        switch (status) {
            case APPOINTMENT_STATUS.PENDING:
                return 'bg-warning text-dark';
            case APPOINTMENT_STATUS.CONFIRMED:
                return 'bg-primary';
            case APPOINTMENT_STATUS.COMPLETED:
                return 'bg-success';
            case APPOINTMENT_STATUS.CANCELLED:
                return 'bg-danger';
            case APPOINTMENT_STATUS.NO_SHOW:
                return 'bg-secondary';
            default:
                return 'bg-secondary';
        }
    };

    return <span className={`badge ${getStatusClass()}`}>{status}</span>;
};

export default StatusBadge;
