# Generated by Django 4.1.1 on 2022-10-06 08:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0009_remove_admin_super_admin'),
    ]

    operations = [
        migrations.AddField(
            model_name='admin',
            name='wallet_address_pk',
            field=models.CharField(default=None, max_length=42),
        ),
    ]
