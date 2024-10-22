import PenyewaHeader from "./PenyewaHeader";
import PenyewaFooter from "./PenyewaFooter";
import { Snackbar,SnackbarContent } from "@mui/material";
export default function PenyewaPage({children,auth,snackbarStates,setSnackbarStates,prevRoute}) {

    return (
        <div className="overflow-y-auto h-full">
            <PenyewaHeader auth={auth} />
            <PenyewaFooter auth={auth} prevRoute={prevRoute}/>
            {/* Snackbar notifikasi */}
            <Snackbar open={snackbarStates.open} onClose={() => setSnackbarStates({open: false})} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} >
                <SnackbarContent style={{backgroundColor: snackbarStates.severity === 'success' ? 'green' : 'red'}} message={snackbarStates.message} />
            </Snackbar>
            <div className="pt-[6rem] pb-[2rem] bg-white overflow-y-auto">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {children}
                </div>
            </div>
        </div>
    );
}