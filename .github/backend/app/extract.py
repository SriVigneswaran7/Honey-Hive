link="https://www.amazon.co.uk/Bluetooth-Headphones-KVIDIO-Microphone-Lightweight-black/dp/B09PQSVFQT/ref=sr_1_1_sspa?crid=3LQGEWV27N7XJ&dib=eyJ2IjoiMSJ9.NfXLjB13X46Utxfght_6y6QIrGnY4tDou4BfLb5ClsVqg1tJfEhoEo35ALvIKwz-R5iivPuzyzCE1IWX3Ztm5aAGDIG3FybV2kJ1928s_Gb4BeOnhtO5VEyssvj4b8TaNcXqmCkSbMJNrJGCWW5DhQQ4gJjD_H1HwpjcHq4zM2OqJZ1IhHQjiSXR6hgOBuv27FC-ntADDAUZvyjL6Y7FSM1aqC8oJdg5B189AJaffuQ.3MGgAhX-uP-62HQ8rTbYeC0QvBqWzp7ZRxHhy5LM914&dib_tag=se&keywords=headphones&qid=1772305213&sprefix=h%2Caps%2C261&sr=8-1-spons&aref=xjpdC0soXE&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1"

#link analysis
split_link=link.split("/")
#classification
if split_link[2]=="www.amazon.co.uk":
    item=split_link[3]
    specs=item.split('-')