# Generated by Django 4.1.1 on 2022-10-05 14:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0008_admin_tx_receipt_partyambassador_tx_receipt_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='admin',
            name='super_admin',
        ),
    ]
