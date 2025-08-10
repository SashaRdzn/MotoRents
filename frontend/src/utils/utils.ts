
export function CheckEmailOnApproveDomen(email: string): boolean {
    const ApproveEmailDomains = ['gmail', 'yandex', 'mail', 'outlook', 'yahoo', 'protonmail']; // TODO: сделать этот список с бэка а то так хуйня
    try {
        const domainPart = email.split('@')[1]?.split('.')[0]?.toLowerCase();
        if (!domainPart) return false;
        // console.log(ApproveEmailDomains.includes(domainPart));
        return ApproveEmailDomains.includes(domainPart);
    } catch (error) {
        console.error('Error checking email domain:', error);
        return false;
    }
}