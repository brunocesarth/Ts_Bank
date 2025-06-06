import { BankAccountType } from "./enums";
import { BankAccount, CheckingAccount, InvestmentAccount, SavingsAccount, VipAccount, withOverdraftLimit } from "./models";

function logAccountDetails(account: BankAccount) {
    console.log(account.toString());
}

function main(args: string[]): void {
    const CheckingAccountWithOverdraft = withOverdraftLimit(CheckingAccount, 100);

    const a1 = new CheckingAccountWithOverdraft("a1", 50);
    const a2 = new SavingsAccount("a2", 50);

    console.log(`${a1}\n${a2}`);

    a1.transferTo(a2, 100);

    console.log(`${a1}\n${a2}`);

    a1.transferTo(a2, 100);

    console.log(`${a1}\n${a2}`);

    a2.transferTo(a1, 151);

    const investimentos: Array<InvestmentAccount> = [];
    investimentos.push(new VipAccount("inv1", 100));

    a1.logStatement();
    a1.logStatement();

    // Polimorfismo
    console.log('polimorfismo...');
    const accounts: Array<BankAccount> = [a1, a2, new VipAccount("a2", 100)];
    accounts.forEach(logAccountDetails);
}

main(process.argv);