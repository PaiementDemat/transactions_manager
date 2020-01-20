# transactions_manager

### required in headers

- content-type: application/json
- authorization: Bearer API_KEY

### endpoints

- /transaction/payment/

```
{
	"transaction": {
		"transaction_details": {
			"amount": AMOUNT,
			"commercant": {
				"email": "EMAIL",
				"amount": 5
			}
		}
	}
}
```

```
{
    "status": "success",
    "transaction_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmFuc2FjdGlvbl9pZCI6IjVlMWQ5ZjMyM2YyMWRjM2M0YzNkZGE2NiIsImNvbW1lcmNhbnQiOiJmbG94IiwiYW1vdW50Ijo1LCJpYXQiOjE1Nzg5OTk2MDMsImV4cCI6MTU3OTAwMDgwM30.DhXTqn6sF6BCNgSEP9HzfuCIz8opSonDJY0eBNdqvgU"
}
```