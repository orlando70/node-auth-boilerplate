import bcrypt from 'bcrypt';
import { ServiceError } from '../errors';
import config from '../../config';


export async function bcryptHash(password: string) {
	const salt = await bcrypt.genSalt();
	return bcrypt.hash(password, salt);
}

export function bcryptCompare(password: string, hash: string) {
	return bcrypt.compare(password, hash);
}

export function successResponse<T>(data?: T) {
	return {
		status: 'success',
		data,
	};
}

export function generateUniqueCode(length: number) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const code = Math.floor(min + Math.random() * (max - min + 1));
  return code.toString();
}


// export const generateReferenceCode = async () => {
// 	const existingRefCode = true;
// 	let generatedRefCode!: string;
// 		while (existingRefCode) {
// 		  generatedRefCode = generateUniqueCode(10);
// 		  const transactionWithRefCode = await TransactionRepo.getTransactionByReference(generatedRefCode);
// 		  if (!transactionWithRefCode) break;
// 		}
	  
// 		return generatedRefCode;
//   };