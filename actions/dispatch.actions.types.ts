import { LineActionRequest } from '../types/Dispatch.types';
import { ExecuteLineActionsOptions } from '../services/dispatchLine.service.types';

export type ExecuteLinesActions = (
    dispatchId: string,
    actions: LineActionRequest[],
    options: ExecuteLineActionsOptions,
) => void;

export enum ReleasePinCodeErrors {
    REQUIRED = 'Required.releasePinCode',
    INVALID_FIRST_ATTEMPT = 'Invalid.releasePinCode.1',
    INVALID_SECOND_ATTEMPT = 'Invalid.releasePinCode.2',
    LIMIT_REACHED = 'Invalid.releasePinCodes.limit.reached',
}
