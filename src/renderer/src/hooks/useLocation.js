import { useMst } from 'store';

const useLocation = () => {
    let { location, path, hash } = useMst().history;

    return { location, path, hash };
}

export default useLocation;
