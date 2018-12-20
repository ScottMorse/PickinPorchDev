export const badUsernames = ['111111', '123456', '12345678', 'abc123', 'abramov', 'account', 'accounting', 'ad', 'adm', 'admin', 'administrator', 'adver', 'advert', 'advertising', 'afanasev', 'agafonov', 'agata', 'aksenov', 'aleksander', 'aleksandrov', 'alekse', 'alenka', 'alexe', 'alexeev', 'alla', 'anatol', 'andre', 'andreev', 'andrey', 'anna', 'anya', 'ao', 'aozt', 'arhipov', 'art', 'avdeev', 'avto', 'bank', 'baranov', 'Baseball', 'belousov', 'bill', 'billing', 'blinov', 'bobrov', 'bogdanov', 'buh', 'buhg', 'buhgalter', 'buhgalteria', 'business', 'bux', 'catchthismail', 'company', 'contact', 'contactus', 'corp', 'design', 'dir', 'director', 'direktor', 'dragon', 'economist', 'edu', 'email', 'er', 'expert', 'export', 'fabrika', 'fin', 'finance', 'ftp', 'glavbuh', 'glavbux', 'glbuh', 'helloitmenice', 'help', 'holding', 'home', 'hr', 'iamjustsendingthisleter', 'info', 'ingthisleter', 'job', 'john', 'kadry', 'letmein', 'mail', 'manager', 'marketing', 'marketing', 'mike', 'mogggnomgon', 'monkey', 'moscow', 'mysql', 'office', 'ok', 'oracle', 'password', 'personal', 'petgord34truew', 'post', 'postmaster', 'pr', 'qwerty', 'rbury', 'reklama', 'root', 'root', 'sale', 'sales', 'secretar', 'sekretar', 'support', 'test', 'testing', 'thisisjusttestletter', 'trade', 'uploader', 'user', 'webmaster', 'www-data']
export const nameRegex = new RegExp(/^[\w\d][\w\d ]*$/)
export const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
export const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.])(?=.{8,})/)
export const lowerCase = new RegExp(/(?=.*[a-z])/)
export const upperCase = new RegExp(/(?=.*[A-Z])/)
export const numeric = new RegExp(/(?=.*[0-9])/)
export const special = new RegExp(/(?=.[!@#\$%\^&\.])/)
export const eightChar = new RegExp(/(?=.{8,})/)