export interface AlertProps {
    variant?:
        | 'primary'
        | 'secondary'
        | 'success'
        | 'info'
        | 'warning'
        | 'danger'
        | 'light'
        | 'dark';
    onClose?: () => void;
    className?: string;
    component?: keyof JSX.IntrinsicElements;
}
