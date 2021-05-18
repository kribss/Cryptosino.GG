from brownie import JackpotGame, accounts


def main():
    acct = accounts.load("metamask")
    JackpotGame.deploy({'from': acct})