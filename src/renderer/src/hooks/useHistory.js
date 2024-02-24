import { useMst } from 'store';


const useHistory = () => {
    let { push, replace, back } = useMst().history
    return { push, replace, back };
}

export default useHistory;
