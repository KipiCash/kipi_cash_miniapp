## ClientUser

- user_id: uuid
- qr_img_url : string

## WorkerUser

- user_id: uuid
- wallet_address : string

## Request

- id : uuid
- status [pending, taken] : enum
- created_at : timestamp
- client_id : uuid

## Transaction

- id : uuid
- status [checking, approved, rejected] : enum
- reject_reason : [falsified, already_charged, ss_error] : enum
- request_id : uuid
- worker_id : uuid
- client_screenshot_img_url : string
- timestamps: TransactionTimestamps
- change_amount : number
- final_amount : number
- response_screenshot_img_url : string

## TransactionTimestamps

- created_at : timestamp
- ss_send_at : timestamp
- ss_result_at : timestamp
- finished_at : timestamp
