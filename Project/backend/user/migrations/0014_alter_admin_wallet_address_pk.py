# Generated by Django 4.1.1 on 2022-10-12 10:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0013_alter_admin_wallet_address_pk'),
    ]

    operations = [
        migrations.AlterField(
            model_name='admin',
            name='wallet_address_pk',
            field=models.CharField(default=None, max_length=64),
        ),
    ]
