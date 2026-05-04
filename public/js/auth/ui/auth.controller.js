import { authService } from "../app/auth.service.js";
import { 
    showAlert,
    clearAlert, 
    autoHideAlert, 
    setLoading 
} from "../../shared/ui/message.ui.js";

// ==== ELEMENTOS DOM ====
const codeInput = document.getElementById('code');
const form = document.getElementById('loginForm');
const submitBtn = document.getElementById('submitBtn');
const backBtn = document.getElementById('backBtn');

// ==== INITIALIZE ====
document.addEventListener('DOMContentLoaded',()=>{
    clearAlert('alert');
})

// ==== EVENT LISTENERS ====
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert('alert');
    const code = codeInput.value.trim();
    if (!code) {
        showAlert('Ingrese su código','error','alert');
        autoHideAlert('alert');
        return;
    }
    setLoading(submitBtn, true);
    try{
        const res = await authService.login({ code });
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        showAlert('Ingreso exitoso', 'success','alert');
        autoHideAlert('alert');
        setTimeout(() => {
            window.location.href = '/pages/admin/dashboard.html';
        }, 800);
    }catch(err){
        const isNetwork = err instanceof TypeError;
        showAlert(
            isNetwork ? 'No se pudo conectar con el servidor' : err.message,
            'error',
            'alert'
        );
        autoHideAlert('alert');
    }finally{
        setLoading(submitBtn, false);
    }
});

backBtn.addEventListener('click', ()=>{
    window.location.href = '/index.html';
})